const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Cấu hình JWT
const JWT_SECRET = 'your_jwt_secret_key'; // Trong thực tế nên lưu trong biến môi trường
const JWT_EXPIRES_IN = '24h';

// Đăng ký người dùng mới
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp đầy đủ thông tin'
            });
        }

        // Đăng ký người dùng mới
        const userId = await User.register({
            name,
            email,
            phone,
            password,
            role: role || 'customer' // Mặc định là khách hàng
        });

        // Lấy thông tin người dùng vừa đăng ký
        const user = await User.getUserById(userId);

        // Tạo token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp email và mật khẩu'
            });
        }

        // Đăng nhập
        const user = await User.login(email, password);

        // Tạo token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy thông tin người dùng hiện tại
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.getUserById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 