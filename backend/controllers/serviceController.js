const Service = require('../models/service');
const Employee = require('../models/employee');

class ServiceController {
    // Lấy danh sách dịch vụ
    async getAllServices(req, res) {
        try {
            const services = await Service.getAllServices();
            res.json({
                success: true,
                data: services
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách dịch vụ',
                error: error.message
            });
        }
    }

    // Lấy thông tin một dịch vụ
    async getServiceById(req, res) {
        try {
            const service = await Service.getServiceById(req.params.id);
            if (!service) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy dịch vụ'
                });
            }
            res.json({
                success: true,
                data: service
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin dịch vụ',
                error: error.message
            });
        }
    }

    // Tạo dịch vụ mới
    async createService(req, res) {
        try {
            const { name, description, duration, price, employee_ids } = req.body;
            
            // Validate dữ liệu đầu vào
            if (!name || !duration || !price) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc'
                });
            }
            
            // Kiểm tra danh sách nhân viên
            let employeeIds = [];
            if (employee_ids && Array.isArray(employee_ids)) {
                employeeIds = employee_ids;
            }
            
            const serviceId = await Service.createService(
                { name, description, duration, price },
                employeeIds
            );
            
            res.status(201).json({
                success: true,
                message: 'Tạo dịch vụ thành công',
                data: { id: serviceId }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo dịch vụ',
                error: error.message
            });
        }
    }

    // Cập nhật dịch vụ
    async updateService(req, res) {
        try {
            const { id } = req.params;
            const { name, description, duration, price, employee_ids } = req.body;
            
            // Validate dữ liệu đầu vào
            if (!name || !duration || !price) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc'
                });
            }
            
            // Kiểm tra danh sách nhân viên
            let employeeIds = [];
            if (employee_ids && Array.isArray(employee_ids)) {
                employeeIds = employee_ids;
            }
            
            const success = await Service.updateService(
                id,
                { name, description, duration, price },
                employeeIds
            );
            
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy dịch vụ'
                });
            }
            
            res.json({
                success: true,
                message: 'Cập nhật dịch vụ thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật dịch vụ',
                error: error.message
            });
        }
    }

    // Xóa dịch vụ
    async deleteService(req, res) {
        try {
            const success = await Service.deleteService(req.params.id);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy dịch vụ'
                });
            }
            res.json({
                success: true,
                message: 'Xóa dịch vụ thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa dịch vụ',
                error: error.message
            });
        }
    }

    // Lấy danh sách nhân viên có thể thực hiện dịch vụ
    async getServiceEmployees(req, res) {
        try {
            const { id } = req.params;
            
            const employees = await Service.getServiceEmployees(id);
            
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
}

module.exports = new ServiceController(); 