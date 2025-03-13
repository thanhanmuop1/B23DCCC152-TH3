const db = require('../configs/database');

const ratingController = {
  // Tạo đánh giá mới
  async createRating(req, res) {
    try {
      const { appointment_id, rating, comment } = req.body;
      
      // Kiểm tra xem lịch hẹn có tồn tại và đã hoàn thành chưa
      const [appointment] = await db.query(
        'SELECT status FROM appointments WHERE id = ?',
        [appointment_id]
      );

      if (!appointment.length) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy lịch hẹn'
        });
      }

      if (appointment[0].status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Chỉ có thể đánh giá các lịch hẹn đã hoàn thành'
        });
      }

      // Kiểm tra xem đã đánh giá chưa
      const [existingRating] = await db.query(
        'SELECT id FROM ratings WHERE appointment_id = ?',
        [appointment_id]
      );

      if (existingRating.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Lịch hẹn này đã được đánh giá'
        });
      }

      // Tạo đánh giá mới
      const [result] = await db.query(
        'INSERT INTO ratings (appointment_id, rating, comment) VALUES (?, ?, ?)',
        [appointment_id, rating, comment]
      );

      // Lấy thông tin đánh giá vừa tạo
      const [newRating] = await db.query(
        `SELECT r.*, 
          a.customer_name, 
          a.appointment_date,
          s.name as service_name,
          e.name as employee_name
        FROM ratings r
        JOIN appointments a ON r.appointment_id = a.id
        JOIN services s ON a.service_id = s.id
        JOIN employees e ON a.employee_id = e.id
        WHERE r.id = ?`,
        [result.insertId]
      );

      res.json({
        success: true,
        message: 'Đánh giá thành công',
        data: newRating[0]
      });
    } catch (error) {
      console.error('Error creating rating:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo đánh giá'
      });
    }
  },

  // Lấy đánh giá theo lịch hẹn
  async getRatingByAppointment(req, res) {
    try {
      const { appointment_id } = req.params;

      const [rating] = await db.query(
        `SELECT r.*, 
          a.customer_name, 
          a.appointment_date,
          s.name as service_name,
          e.name as employee_name
        FROM ratings r
        JOIN appointments a ON r.appointment_id = a.id
        JOIN services s ON a.service_id = s.id
        JOIN employees e ON a.employee_id = e.id
        WHERE r.appointment_id = ?`,
        [appointment_id]
      );

      if (!rating.length) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đánh giá cho lịch hẹn này'
        });
      }

      res.json({
        success: true,
        data: rating[0]
      });
    } catch (error) {
      console.error('Error getting rating:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy đánh giá'
      });
    }
  },

  // Lấy tất cả đánh giá của một dịch vụ
  async getRatingsByService(req, res) {
    try {
      const { service_id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const [ratings] = await db.query(
        `SELECT r.*, 
          a.customer_name, 
          a.appointment_date,
          s.name as service_name,
          e.name as employee_name
        FROM ratings r
        JOIN appointments a ON r.appointment_id = a.id
        JOIN services s ON a.service_id = s.id
        JOIN employees e ON a.employee_id = e.id
        WHERE s.id = ?
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?`,
        [service_id, parseInt(limit), offset]
      );

      // Lấy tổng số đánh giá
      const [total] = await db.query(
        `SELECT COUNT(*) as total
        FROM ratings r
        JOIN appointments a ON r.appointment_id = a.id
        WHERE a.service_id = ?`,
        [service_id]
      );

      // Tính điểm trung bình
      const [avgRating] = await db.query(
        `SELECT AVG(r.rating) as average_rating
        FROM ratings r
        JOIN appointments a ON r.appointment_id = a.id
        WHERE a.service_id = ?`,
        [service_id]
      );

      res.json({
        success: true,
        data: {
          ratings,
          total: total[0].total,
          average_rating: avgRating[0].average_rating || 0,
          current_page: parseInt(page),
          total_pages: Math.ceil(total[0].total / limit)
        }
      });
    } catch (error) {
      console.error('Error getting service ratings:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy đánh giá dịch vụ'
      });
    }
  },

  // Lấy tất cả đánh giá của một nhân viên
  async getRatingsByEmployee(req, res) {
    try {
      const { employee_id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const [ratings] = await db.query(
        `SELECT r.*, 
          a.customer_name, 
          a.appointment_date,
          s.name as service_name,
          e.name as employee_name
        FROM ratings r
        JOIN appointments a ON r.appointment_id = a.id
        JOIN services s ON a.service_id = s.id
        JOIN employees e ON a.employee_id = e.id
        WHERE e.id = ?
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?`,
        [employee_id, parseInt(limit), offset]
      );

      // Lấy tổng số đánh giá
      const [total] = await db.query(
        `SELECT COUNT(*) as total
        FROM ratings r
        JOIN appointments a ON r.appointment_id = a.id
        WHERE a.employee_id = ?`,
        [employee_id]
      );

      // Tính điểm trung bình
      const [avgRating] = await db.query(
        `SELECT AVG(r.rating) as average_rating
        FROM ratings r
        JOIN appointments a ON r.appointment_id = a.id
        WHERE a.employee_id = ?`,
        [employee_id]
      );

      res.json({
        success: true,
        data: {
          ratings,
          total: total[0].total,
          average_rating: avgRating[0].average_rating || 0,
          current_page: parseInt(page),
          total_pages: Math.ceil(total[0].total / limit)
        }
      });
    } catch (error) {
      console.error('Error getting employee ratings:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy đánh giá nhân viên'
      });
    }
  }
};

module.exports = ratingController; 