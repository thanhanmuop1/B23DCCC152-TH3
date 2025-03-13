const db = require('../configs/database');
const bcrypt = require('bcrypt');

class User {
    // Đăng ký người dùng mới
    static async register(userData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Kiểm tra email đã tồn tại chưa
            const [existingUsers] = await connection.execute(
                'SELECT * FROM users WHERE email = ?',
                [userData.email]
            );

            if (existingUsers.length > 0) {
                throw new Error('Email đã được sử dụng');
            }

            // Mã hóa mật khẩu
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            // Thêm người dùng mới
            const [result] = await connection.execute(
                'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
                [userData.name, userData.email, userData.phone, hashedPassword, userData.role || 'customer']
            );

            await connection.commit();
            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Đăng nhập
    static async login(email, password) {
        try {
            // Tìm người dùng theo email
            const [users] = await db.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                throw new Error('Email hoặc mật khẩu không đúng');
            }

            const user = users[0];

            // Kiểm tra mật khẩu
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Email hoặc mật khẩu không đúng');
            }

            // Không trả về mật khẩu
            delete user.password;
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Lấy thông tin người dùng theo ID
    static async getUserById(id) {
        try {
            const [users] = await db.execute(
                'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
                [id]
            );

            if (users.length === 0) {
                return null;
            }

            return users[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User; 