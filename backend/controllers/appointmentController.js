const Appointment = require('../models/appointment');
const Employee = require('../models/employee');
const Service = require('../models/service');

class AppointmentController {
    // Lấy danh sách lịch hẹn
    async getAppointments(req, res) {
        try {
            const filters = {
                status: req.query.status,
                from_date: req.query.from_date,
                to_date: req.query.to_date,
                employee_id: req.query.employee_id,
                customer_phone: req.query.customer_phone
            };

            const appointments = await Appointment.getAppointments(filters);
            res.json({
                success: true,
                data: appointments
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách lịch hẹn',
                error: error.message
            });
        }
    }

    // Tạo lịch hẹn mới
    async createAppointment(req, res) {
        try {
            const { customer_name, customer_phone, employee_id, service_id, appointment_date, appointment_time } = req.body;

            // Validate dữ liệu đầu vào
            if (!customer_name || !customer_phone || !employee_id || !service_id || !appointment_date || !appointment_time) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc'
                });
            }

            // Kiểm tra ngày giờ hợp lệ
            const appointmentDateTime = new Date(`${appointment_date}T${appointment_time}`);
            if (appointmentDateTime < new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể đặt lịch cho thời gian đã qua'
                });
            }

            // Lấy thông tin dịch vụ
            const service = await Service.getServiceById(service_id);
            if (!service) {
                return res.status(404).json({
                    success: false,
                    message: 'Dịch vụ không tồn tại'
                });
            }

            // Tính thời gian kết thúc
            const startTime = new Date(`1970-01-01T${appointment_time}`);
            const endTime = new Date(startTime.getTime() + service.duration * 60000);
            const endTimeStr = endTime.toTimeString().split(' ')[0];

            // Kiểm tra lịch trùng
            const isOverlapping = await Appointment.checkOverlappingAppointments(
                employee_id,
                appointment_date,
                appointment_time,
                endTimeStr
            );

            if (isOverlapping) {
                return res.status(400).json({
                    success: false,
                    message: 'Thời gian này đã có lịch hẹn khác'
                });
            }

            // Kiểm tra giới hạn khách/ngày
            const isLimitReached = await Appointment.checkDailyCustomerLimit(
                employee_id,
                appointment_date
            );

            if (isLimitReached) {
                return res.status(400).json({
                    success: false,
                    message: 'Nhân viên đã đạt giới hạn số lượng khách trong ngày'
                });
            }

            // Tạo lịch hẹn
            const appointmentId = await Appointment.createAppointment({
                customer_name,
                customer_phone,
                employee_id,
                service_id,
                appointment_date,
                appointment_time,
                end_time: endTimeStr
            });

            res.status(201).json({
                success: true,
                message: 'Đặt lịch hẹn thành công',
                data: { id: appointmentId }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo lịch hẹn',
                error: error.message
            });
        }
    }

    // Cập nhật trạng thái lịch hẹn
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            // Validate trạng thái
            const validStatuses = ['confirmed', 'completed', 'canceled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Trạng thái không hợp lệ'
                });
            }

            const success = await Appointment.updateStatus(id, status);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy lịch hẹn'
                });
            }

            res.json({
                success: true,
                message: 'Cập nhật trạng thái thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật trạng thái',
                error: error.message
            });
        }
    }

    // Lấy chi tiết lịch hẹn
    async getAppointmentById(req, res) {
        try {
            const appointment = await Appointment.getAppointmentById(req.params.id);
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy lịch hẹn'
                });
            }

            res.json({
                success: true,
                data: appointment
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin lịch hẹn',
                error: error.message
            });
        }
    }

    // Lấy các slot trống
    async getAvailableSlots(req, res) {
        try {
            const { employee_id, date, service_id } = req.query;

            if (!employee_id || !date || !service_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc'
                });
            }

            const slots = await Appointment.getAvailableSlots(
                employee_id,
                date,
                service_id
            );

            res.json({
                success: true,
                data: slots
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách slot trống',
                error: error.message
            });
        }
    }
}

module.exports = new AppointmentController(); 