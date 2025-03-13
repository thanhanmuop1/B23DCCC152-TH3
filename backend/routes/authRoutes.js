const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Đăng ký
router.post('/register', authController.register);

// Đăng nhập
router.post('/login', authController.login);

// Lấy thông tin người dùng hiện tại (cần xác thực)
router.get('/me', protect, authController.getCurrentUser);

module.exports = router; 