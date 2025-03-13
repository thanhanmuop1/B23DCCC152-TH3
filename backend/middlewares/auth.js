const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Cấu hình JWT
const JWT_SECRET = 'your_jwt_secret_key'; // Nên giống với cấu hình trong authController

// Middleware xác thực người dùng
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Kiểm tra token trong header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Nếu không có token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập để truy cập'
            });
        }

        try {
            // Xác thực token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Lấy thông tin người dùng
            const user = await User.getUserById(decoded.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Người dùng không tồn tại'
                });
            }

            // Lưu thông tin người dùng vào request
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ hoặc đã hết hạn'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi xác thực',
            error: error.message
        });
    }
};

// Middleware kiểm tra quyền
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập'
            });
        }
        next();
    };
}; 