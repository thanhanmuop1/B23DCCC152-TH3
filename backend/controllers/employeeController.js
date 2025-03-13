const Employee = require('../models/employee');

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
            const { name, phone, max_customers_per_day, start_time, end_time, work_days } = req.body;
            console.log('req.body', req.body);

            // Kiểm tra dữ liệu đầu vào
            if (!name || !phone || !max_customers_per_day || !start_time || !end_time || !work_days) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc'
                });
            }
            console.log('work_days', work_days);
            // Kiểm tra số ngày làm việc
            if (!work_days || work_days.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Phải có ít nhất 1 ngày làm việc'
                });
            }
            console.log('work_days_length', Array.isArray(work_days));
            if (work_days.length > 7) {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể đăng ký quá 7 ngày làm việc trong tuần'
                });
            }
            console.log('work_days', work_days);
            // Kiểm tra trùng lặp ngày làm việc
            const uniqueDays = new Set(work_days);
            if (uniqueDays.size !== work_days.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể đăng ký trùng lặp ngày làm việc'
                });
            }
            console.log('start_time', start_time);
            console.log('end_time', end_time);
            // Kiểm tra thời gian làm việc hợp lệ
            const startTime = new Date(`2000-01-01 ${start_time}`);
            const endTime = new Date(`2000-01-01 ${end_time}`);
            
            if (endTime <= startTime) {
                return res.status(400).json({
                    success: false,
                    message: 'Thời gian kết thúc phải sau thời gian bắt đầu'
                });
            }
            
            const employeeData = {
                name,
                phone,
                max_customers_per_day,
                start_time,
                end_time,
                work_days
            };

            const employeeId = await Employee.createEmployee(employeeData);
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
            const { name, phone, max_customers_per_day, start_time, end_time, work_days } = req.body;
            const employeeId = req.params.id;
            console.log('req.body', req.body);
            // Kiểm tra dữ liệu đầu vào
            if (!name || !phone || !max_customers_per_day) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc'
                });
            }

            if (work_days) {
                // Kiểm tra số ngày làm việc
                if (work_days.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Phải có ít nhất 1 ngày làm việc'
                    });
                }

                if (work_days.length > 7) {
                    return res.status(400).json({
                        success: false,
                        message: 'Không thể đăng ký quá 7 ngày làm việc trong tuần'
                    });
                }

                // Kiểm tra trùng lặp ngày làm việc
                const uniqueDays = new Set(work_days);
                if (uniqueDays.size !== work_days.length) {
                    return res.status(400).json({
                        success: false,
                        message: 'Không thể đăng ký trùng lặp ngày làm việc'
                    });
                }
            }
            console.log('start_time', start_time);
            console.log('end_time', end_time);
            // Kiểm tra thời gian làm việc hợp lệ
            if (start_time && end_time) {
                const startTime = new Date(`2000-01-01 ${start_time}`);
                const endTime = new Date(`2000-01-01 ${end_time}`);
                
                if (endTime <= startTime) {
                    return res.status(400).json({
                        success: false,
                        message: 'Thời gian kết thúc phải sau thời gian bắt đầu'
                    });
                }
            }

            const employeeData = {
                name,
                phone,
                max_customers_per_day,
                start_time,
                end_time,
                work_days
            };

            await Employee.updateEmployee(employeeId, employeeData);
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