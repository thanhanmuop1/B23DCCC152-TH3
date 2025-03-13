const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

// Tạo đánh giá mới
router.post('/', ratingController.createRating);

// Lấy đánh giá theo lịch hẹn
router.get('/appointment/:appointment_id', ratingController.getRatingByAppointment);

// Lấy đánh giá theo dịch vụ
router.get('/service/:service_id', ratingController.getRatingsByService);

// Lấy đánh giá theo nhân viên
router.get('/employee/:employee_id', ratingController.getRatingsByEmployee);

module.exports = router; 