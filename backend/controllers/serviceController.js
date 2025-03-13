const Service = require('../models/service');

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
            const { name, description, price, duration } = req.body;

            // Validate dữ liệu
            if (!name || !price || !duration) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc'
                });
            }

            if (price <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Giá dịch vụ phải lớn hơn 0'
                });
            }

            if (duration <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Thời gian thực hiện phải lớn hơn 0 phút'
                });
            }

            const serviceId = await Service.createService({
                name,
                description,
                price,
                duration
            });

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
            const { name, description, price, duration } = req.body;
            const serviceId = req.params.id;

            // Validate dữ liệu
            if (!name || !price || !duration) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc'
                });
            }

            if (price <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Giá dịch vụ phải lớn hơn 0'
                });
            }

            if (duration <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Thời gian thực hiện phải lớn hơn 0 phút'
                });
            }

            const success = await Service.updateService(serviceId, {
                name,
                description,
                price,
                duration
            });

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
}

module.exports = new ServiceController(); 