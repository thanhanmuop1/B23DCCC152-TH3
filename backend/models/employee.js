const db = require('../configs/database');

class Employee {
    // Lấy tất cả nhân viên với lịch làm việc
    static async getAllEmployees() {
        try {
            const query = `
                SELECT e.*, 
                       ws.start_time, ws.end_time,
                       GROUP_CONCAT(DISTINCT ewd.work_day) as work_days
                FROM employees e
                LEFT JOIN work_schedules ws ON e.id = ws.employee_id
                LEFT JOIN employee_work_days ewd ON e.id = ewd.employee_id
                GROUP BY e.id
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
                SELECT e.*, 
                       ws.start_time, ws.end_time,
                       GROUP_CONCAT(DISTINCT ewd.work_day) as work_days
                FROM employees e
                LEFT JOIN work_schedules ws ON e.id = ws.employee_id
                LEFT JOIN employee_work_days ewd ON e.id = ewd.employee_id
                WHERE e.id = ?
                GROUP BY e.id
            `;
            const [employee] = await db.execute(query, [id]);
            return employee[0];
        } catch (error) {
            throw error;
        }
    }

    // Thêm nhân viên mới
    static async createEmployee(employeeData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Thêm thông tin nhân viên
            const employeeQuery = `
                INSERT INTO employees (name, phone, max_customers_per_day)
                VALUES (?, ?, ?)
            `;
            const [employeeResult] = await connection.execute(employeeQuery, [
                employeeData.name,
                employeeData.phone,
                employeeData.max_customers_per_day
            ]);

            const employeeId = employeeResult.insertId;

            // Thêm lịch làm việc
            if (employeeData.start_time && employeeData.end_time) {
                const scheduleQuery = `
                    INSERT INTO work_schedules (employee_id, start_time, end_time)
                    VALUES (?, ?, ?)
                `;
                await connection.execute(scheduleQuery, [
                    employeeId,
                    employeeData.start_time,
                    employeeData.end_time
                ]);
            }

            // Thêm ngày làm việc
            if (employeeData.work_days && employeeData.work_days.length > 0) {
                const workDayQuery = `
                    INSERT INTO employee_work_days (employee_id, work_day)
                    VALUES (?, ?)
                `;
                for (const day of employeeData.work_days) {
                    await connection.execute(workDayQuery, [
                        employeeId,
                        day
                    ]);
                }
            }

            await connection.commit();
            return employeeId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Cập nhật thông tin nhân viên
    static async updateEmployee(id, employeeData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Cập nhật thông tin nhân viên
            const employeeQuery = `
                UPDATE employees
                SET name = ?, phone = ?, max_customers_per_day = ?
                WHERE id = ?
            `;
            await connection.execute(employeeQuery, [
                employeeData.name,
                employeeData.phone,
                employeeData.max_customers_per_day,
                id
            ]);

            // Cập nhật lịch làm việc
            if (employeeData.start_time && employeeData.end_time) {
                // Xóa lịch làm việc cũ
                await connection.execute('DELETE FROM work_schedules WHERE employee_id = ?', [id]);

                // Thêm lịch làm việc mới
                const scheduleQuery = `
                    INSERT INTO work_schedules (employee_id, start_time, end_time)
                    VALUES (?, ?, ?)
                `;
                await connection.execute(scheduleQuery, [
                    id,
                    employeeData.start_time,
                    employeeData.end_time
                ]);
            }

            // Cập nhật ngày làm việc
            if (employeeData.work_days) {
                // Xóa ngày làm việc cũ
                await connection.execute('DELETE FROM employee_work_days WHERE employee_id = ?', [id]);

                // Thêm ngày làm việc mới
                if (employeeData.work_days.length > 0) {
                    const workDayQuery = `
                        INSERT INTO employee_work_days (employee_id, work_day)
                        VALUES (?, ?)
                    `;
                    for (const day of employeeData.work_days) {
                        await connection.execute(workDayQuery, [
                            id,
                            day
                        ]);
                    }
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
            const query = `DELETE FROM employees WHERE id = ?`;
            const [result] = await db.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Employee;
