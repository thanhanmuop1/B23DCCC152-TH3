const db = require('../configs/database');
const moment = require('moment');

const statisticsController = {
  // Thống kê số lượng lịch hẹn theo ngày
  async getAppointmentsByDay(req, res) {
    try {
      const { start_date, end_date } = req.query;
      
      const query = `
        SELECT 
          DATE(appointment_date) as date,
          COUNT(*) as total_appointments,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'canceled' THEN 1 END) as canceled,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
        FROM appointments
        WHERE appointment_date BETWEEN ? AND ?
        GROUP BY DATE(appointment_date)
        ORDER BY date ASC
      `;

      const [results] = await db.query(query, [start_date, end_date]);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error getting appointments statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê lịch hẹn theo ngày'
      });
    }
  },

  // Thống kê số lượng lịch hẹn theo tháng
  async getAppointmentsByMonth(req, res) {
    try {
      const { year } = req.query;
      
      const query = `
        SELECT 
          MONTH(appointment_date) as month,
          COUNT(*) as total_appointments,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'canceled' THEN 1 END) as canceled,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
        FROM appointments
        WHERE YEAR(appointment_date) = ?
        GROUP BY MONTH(appointment_date)
        ORDER BY month ASC
      `;

      const [results] = await db.query(query, [year]);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error getting monthly appointments statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê lịch hẹn theo tháng'
      });
    }
  },

  // Thống kê doanh thu theo dịch vụ
  async getRevenueByService(req, res) {
    try {
      const { start_date, end_date } = req.query;
      
      const query = `
        SELECT 
          s.id as service_id,
          s.name as service_name,
          COUNT(a.id) as total_appointments,
          COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_appointments,
          SUM(CASE WHEN a.status = 'completed' THEN s.price ELSE 0 END) as total_revenue
        FROM services s
        LEFT JOIN appointments a ON s.id = a.service_id
          AND a.appointment_date BETWEEN ? AND ?
        GROUP BY s.id, s.name
        ORDER BY total_revenue DESC
      `;

      const [results] = await db.query(query, [start_date, end_date]);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error getting service revenue statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê doanh thu theo dịch vụ'
      });
    }
  },

  // Thống kê doanh thu theo nhân viên
  async getRevenueByEmployee(req, res) {
    try {
      const { start_date, end_date } = req.query;
      
      const query = `
        SELECT 
          e.id as employee_id,
          e.name as employee_name,
          COUNT(a.id) as total_appointments,
          COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_appointments,
          SUM(CASE WHEN a.status = 'completed' THEN s.price ELSE 0 END) as total_revenue
        FROM employees e
        LEFT JOIN appointments a ON e.id = a.employee_id
          AND a.appointment_date BETWEEN ? AND ?
        LEFT JOIN services s ON a.service_id = s.id
        GROUP BY e.id, e.name
        ORDER BY total_revenue DESC
      `;

      const [results] = await db.query(query, [start_date, end_date]);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error getting employee revenue statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê doanh thu theo nhân viên'
      });
    }
  },

  // Thống kê tổng quan
  async getDashboardStats(req, res) {
    try {
      const today = moment().format('YYYY-MM-DD');
      const firstDayOfMonth = moment().startOf('month').format('YYYY-MM-DD');
      
      // Thống kê hôm nay
      const todayStatsQuery = `
        SELECT 
          COUNT(*) as total_appointments,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          SUM(CASE WHEN status = 'completed' THEN s.price ELSE 0 END) as revenue
        FROM appointments a
        LEFT JOIN services s ON a.service_id = s.id
        WHERE DATE(appointment_date) = ?
      `;

      // Thống kê tháng này
      const monthStatsQuery = `
        SELECT 
          COUNT(*) as total_appointments,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          SUM(CASE WHEN status = 'completed' THEN s.price ELSE 0 END) as revenue
        FROM appointments a
        LEFT JOIN services s ON a.service_id = s.id
        WHERE appointment_date >= ?
      `;

      const [[todayStats], [monthStats]] = await Promise.all([
        db.query(todayStatsQuery, [today]),
        db.query(monthStatsQuery, [firstDayOfMonth])
      ]);

      res.json({
        success: true,
        data: {
          today: todayStats[0],
          month: monthStats[0]
        }
      });
    } catch (error) {
      console.error('Error getting dashboard statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê tổng quan'
      });
    }
  }
};

module.exports = statisticsController; 