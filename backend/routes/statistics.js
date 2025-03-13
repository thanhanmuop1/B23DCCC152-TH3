const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

// Thống kê lịch hẹn theo ngày
router.get('/appointments/daily', statisticsController.getAppointmentsByDay);

// Thống kê lịch hẹn theo tháng
router.get('/appointments/monthly', statisticsController.getAppointmentsByMonth);

// Thống kê doanh thu theo dịch vụ
router.get('/revenue/services', statisticsController.getRevenueByService);

// Thống kê doanh thu theo nhân viên
router.get('/revenue/employees', statisticsController.getRevenueByEmployee);

// Thống kê tổng quan cho dashboard
router.get('/dashboard', statisticsController.getDashboardStats);

module.exports = router; 