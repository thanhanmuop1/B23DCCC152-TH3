const Employee = require('../models/employee');
const bcrypt = require('bcryptjs');

class EmployeeController {
    // Lấy danh sách nhân viên
    async getAllEmployees(req, res) {
        try {
            const employees = await Employee.getAllEmployees();
            res.json({
                success: true,
                data: employees
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách nhân viên',
                error: error.message
            });
        }
    }

    // Lấy thông tin một nhân viên
    async getEmployeeById(req, res) {
        try {
            const employee = await Employee.getEmployeeById(req.params.id);
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy nhân viên'
                });
            }
            res.json({
                success: true,
                data: employee
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin nhân viên',
                error: error.message
            });
        }
    }

    // Tạo nhân viên mới
    async createEmployee(req, res) {
        try {
            const { name, email, phone, password, max_customers_per_day, schedules } = req.body;

            // Kiểm tra số ngày làm việc
            if (!schedules || schedules.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Phải có ít nhất 1 ngày làm việc'
                });
            }

            if (schedules.length > 7) {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể đăng ký quá 7 ngày làm việc trong tuần'
                });
            }

            // Kiểm tra trùng lặp ngày làm việc
            const uniqueDays = new Set(schedules.map(s => s.day_of_week));
            if (uniqueDays.size !== schedules.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể đăng ký trùng lặp ngày làm việc'
                });
            }

            // Kiểm tra thời gian làm việc hợp lệ
            for (const schedule of schedules) {
                const startTime = new Date(`2000-01-01 ${schedule.start_time}`);
                const endTime = new Date(`2000-01-01 ${schedule.end_time}`);
                
                if (endTime <= startTime) {
                    return res.status(400).json({
                        success: false,
                        message: 'Thời gian kết thúc phải sau thời gian bắt đầu'
                    });
                }
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            const userData = {
                name,
                email,
                phone,
                password: hashedPassword
            };

            const employeeData = {
                max_customers_per_day,
                schedules
            };

            const employeeId = await Employee.createEmployee(userData, employeeData);
            res.status(201).json({
                success: true,
                message: 'Tạo nhân viên thành công',
                data: { id: employeeId }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo nhân viên',
                error: error.message
            });
        }
    }

    // Cập nhật thông tin nhân viên
    async updateEmployee(req, res) {
        try {
            const { name, email, phone, max_customers_per_day, schedules } = req.body;
            const employeeId = req.params.id;

            if (schedules) {
                // Kiểm tra số ngày làm việc
                if (schedules.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Phải có ít nhất 1 ngày làm việc'
                    });
                }

                if (schedules.length > 7) {
                    return res.status(400).json({
                        success: false,
                        message: 'Không thể đăng ký quá 7 ngày làm việc trong tuần'
                    });
                }

                // Kiểm tra trùng lặp ngày làm việc
                const uniqueDays = new Set(schedules.map(s => s.day_of_week));
                if (uniqueDays.size !== schedules.length) {
                    return res.status(400).json({
                        success: false,
                        message: 'Không thể đăng ký trùng lặp ngày làm việc'
                    });
                }

                // Kiểm tra thời gian làm việc hợp lệ
                for (const schedule of schedules) {
                    const startTime = new Date(`2000-01-01 ${schedule.start_time}`);
                    const endTime = new Date(`2000-01-01 ${schedule.end_time}`);
                    
                    if (endTime <= startTime) {
                        return res.status(400).json({
                            success: false,
                            message: 'Thời gian kết thúc phải sau thời gian bắt đầu'
                        });
                    }
                }
            }

            const userData = {
                name,
                email,
                phone
            };

            const employeeData = {
                max_customers_per_day,
                schedules
            };

            await Employee.updateEmployee(employeeId, userData, employeeData);
            res.json({
                success: true,
                message: 'Cập nhật nhân viên thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật nhân viên',
                error: error.message
            });
        }
    }

    // Xóa nhân viên
    async deleteEmployee(req, res) {
        try {
            const result = await Employee.deleteEmployee(req.params.id);
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy nhân viên'
                });
            }
            res.json({
                success: true,
                message: 'Xóa nhân viên thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa nhân viên',
                error: error.message
            });
        }
    }
}

module.exports = new EmployeeController(); 