const db = require('../configs/database');

class Employee {
    // Lấy tất cả nhân viên với thông tin user
    static async getAllEmployees() {
        try {
            const query = `
                SELECT e.*, u.name, u.email, u.phone, ws.day_of_week, ws.start_time, ws.end_time
                FROM employees e
                JOIN users u ON e.user_id = u.id
                LEFT JOIN work_schedules ws ON e.id = ws.employee_id
            `;
            const [employees] = await db.execute(query);
            return employees;
        } catch (error) {
            throw error;
        }
    }

    // Lấy thông tin một nhân viên theo ID
    static async getEmployeeById(id) {
        try {
            const query = `
                SELECT e.*, u.name, u.email, u.phone, ws.day_of_week, ws.start_time, ws.end_time
                FROM employees e
                JOIN users u ON e.user_id = u.id
                LEFT JOIN work_schedules ws ON e.id = ws.employee_id
                WHERE e.id = ?
            `;
            const [employee] = await db.execute(query, [id]);
            return employee[0];
        } catch (error) {
            throw error;
        }
    }

    // Thêm nhân viên mới
    static async createEmployee(userData, employeeData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Thêm user mới với role 'employee'
            const userQuery = `
                INSERT INTO users (name, email, phone, password, role)
                VALUES (?, ?, ?, ?, 'employee')
            `;
            const [userResult] = await connection.execute(userQuery, [
                userData.name,
                userData.email,
                userData.phone,
                userData.password
            ]);

            // Thêm thông tin nhân viên
            const employeeQuery = `
                INSERT INTO employees (user_id, max_customers_per_day)
                VALUES (?, ?)
            `;
            const [employeeResult] = await connection.execute(employeeQuery, [
                userResult.insertId,
                employeeData.max_customers_per_day
            ]);

            // Thêm lịch làm việc
            if (employeeData.schedules && employeeData.schedules.length > 0) {
                const scheduleQuery = `
                    INSERT INTO work_schedules (employee_id, day_of_week, start_time, end_time)
                    VALUES (?, ?, ?, ?)
                `;
                for (const schedule of employeeData.schedules) {
                    await connection.execute(scheduleQuery, [
                        employeeResult.insertId,
                        schedule.day_of_week,
                        schedule.start_time,
                        schedule.end_time
                    ]);
                }
            }

            await connection.commit();
            return employeeResult.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Cập nhật thông tin nhân viên
    static async updateEmployee(id, userData, employeeData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Cập nhật thông tin user
            const userQuery = `
                UPDATE users u
                JOIN employees e ON u.id = e.user_id
                SET u.name = ?, u.email = ?, u.phone = ?
                WHERE e.id = ?
            `;
            await connection.execute(userQuery, [
                userData.name,
                userData.email,
                userData.phone,
                id
            ]);

            // Cập nhật thông tin nhân viên
            const employeeQuery = `
                UPDATE employees
                SET max_customers_per_day = ?
                WHERE id = ?
            `;
            await connection.execute(employeeQuery, [employeeData.max_customers_per_day, id]);

            // Cập nhật lịch làm việc
            if (employeeData.schedules) {
                // Xóa lịch làm việc cũ
                await connection.execute('DELETE FROM work_schedules WHERE employee_id = ?', [id]);

                // Thêm lịch làm việc mới
                const scheduleQuery = `
                    INSERT INTO work_schedules (employee_id, day_of_week, start_time, end_time)
                    VALUES (?, ?, ?, ?)
                `;
                for (const schedule of employeeData.schedules) {
                    await connection.execute(scheduleQuery, [
                        id,
                        schedule.day_of_week,
                        schedule.start_time,
                        schedule.end_time
                    ]);
                }
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Xóa nhân viên
    static async deleteEmployee(id) {
        try {
            const query = `
                DELETE u FROM users u
                JOIN employees e ON u.id = e.user_id
                WHERE e.id = ?
            `;
            const [result] = await db.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Employee;
