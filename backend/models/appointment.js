const db = require('../configs/database');

class Appointment {
    // Lấy tất cả lịch hẹn với filter
    static async getAppointments(filters = {}) {
        try {
            let query = `
                SELECT a.*, 
                       c.name as customer_name, c.phone as customer_phone,
                       e.max_customers_per_day,
                       s.name as service_name, s.duration as service_duration,
                       s.price as service_price
                FROM appointments a
                JOIN users c ON a.customer_id = c.id
                JOIN employees e ON a.employee_id = e.id
                JOIN services s ON a.service_id = s.id
                WHERE 1=1
            `;
            const params = [];

            if (filters.status) {
                query += ' AND a.status = ?';
                params.push(filters.status);
            }

            if (filters.from_date) {
                query += ' AND a.appointment_date >= ?';
                params.push(filters.from_date);
            }

            if (filters.to_date) {
                query += ' AND a.appointment_date <= ?';
                params.push(filters.to_date);
            }

            if (filters.employee_id) {
                query += ' AND a.employee_id = ?';
                params.push(filters.employee_id);
            }

            if (filters.customer_id) {
                query += ' AND a.customer_id = ?';
                params.push(filters.customer_id);
            }

            query += ' ORDER BY a.appointment_date, a.appointment_time';

            const [appointments] = await db.execute(query, params);
            return appointments;
        } catch (error) {
            throw error;
        }
    }

    // Kiểm tra lịch trình trùng
    static async checkOverlappingAppointments(employeeId, date, startTime, duration) {
        try {
            const query = `
                SELECT a.*, s.duration
                FROM appointments a
                JOIN services s ON a.service_id = s.id
                WHERE a.employee_id = ?
                AND a.appointment_date = ?
                AND a.status NOT IN ('canceled')
                AND (
                    (a.appointment_time <= ? AND ADDTIME(a.appointment_time, SEC_TO_TIME(s.duration * 60)) > ?)
                    OR
                    (a.appointment_time < ADDTIME(?, SEC_TO_TIME(? * 60)) AND a.appointment_time >= ?)
                )
            `;
            
            const [overlapping] = await db.execute(query, [
                employeeId,
                date,
                startTime,
                startTime,
                startTime,
                duration,
                startTime
            ]);

            return overlapping.length > 0;
        } catch (error) {
            throw error;
        }
    }

    // Kiểm tra số lượng khách trong ngày
    static async checkDailyCustomerLimit(employeeId, date) {
        try {
            const query = `
                SELECT COUNT(*) as count, e.max_customers_per_day
                FROM appointments a
                JOIN employees e ON a.employee_id = e.id
                WHERE a.employee_id = ?
                AND a.appointment_date = ?
                AND a.status NOT IN ('canceled')
                GROUP BY e.max_customers_per_day
            `;
            
            const [result] = await db.execute(query, [employeeId, date]);
            if (result.length === 0) return false;
            
            return result[0].count >= result[0].max_customers_per_day;
        } catch (error) {
            throw error;
        }
    }

    // Tạo lịch hẹn mới
    static async createAppointment(appointmentData) {
        try {
            const query = `
                INSERT INTO appointments 
                (customer_id, employee_id, service_id, appointment_date, appointment_time, status)
                VALUES (?, ?, ?, ?, ?, 'pending')
            `;
            
            const [result] = await db.execute(query, [
                appointmentData.customer_id,
                appointmentData.employee_id,
                appointmentData.service_id,
                appointmentData.appointment_date,
                appointmentData.appointment_time
            ]);

            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật trạng thái lịch hẹn
    static async updateStatus(id, status) {
        try {
            const query = `
                UPDATE appointments
                SET status = ?
                WHERE id = ?
            `;
            
            const [result] = await db.execute(query, [status, id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Lấy chi tiết lịch hẹn
    static async getAppointmentById(id) {
        try {
            const query = `
                SELECT a.*, 
                       c.name as customer_name, c.phone as customer_phone,
                       e.max_customers_per_day,
                       s.name as service_name, s.duration as service_duration,
                       s.price as service_price
                FROM appointments a
                JOIN users c ON a.customer_id = c.id
                JOIN employees e ON a.employee_id = e.id
                JOIN services s ON a.service_id = s.id
                WHERE a.id = ?
            `;
            
            const [appointments] = await db.execute(query, [id]);
            return appointments[0];
        } catch (error) {
            throw error;
        }
    }

    // Lấy các slot trống
    static async getAvailableSlots(employeeId, date, serviceId) {
        try {
            // Lấy thông tin dịch vụ
            const [service] = await db.execute(
                'SELECT duration FROM services WHERE id = ?',
                [serviceId]
            );
            
            if (!service.length) throw new Error('Dịch vụ không tồn tại');
            
            const serviceDuration = service[0].duration;

            // Lấy lịch làm việc của nhân viên
            const [schedule] = await db.execute(
                `SELECT start_time, end_time 
                 FROM work_schedules 
                 WHERE employee_id = ? 
                 AND day_of_week = DAYNAME(?)`,
                [employeeId, date]
            );

            if (!schedule.length) return [];

            // Lấy tất cả lịch hẹn trong ngày
            const [appointments] = await db.execute(
                `SELECT a.appointment_time, s.duration
                 FROM appointments a
                 JOIN services s ON a.service_id = s.id
                 WHERE a.employee_id = ?
                 AND a.appointment_date = ?
                 AND a.status NOT IN ('canceled')
                 ORDER BY a.appointment_time`,
                [employeeId, date]
            );

            // Tính toán các slot trống
            const slots = [];
            let currentTime = schedule[0].start_time;
            const endTime = schedule[0].end_time;

            while (currentTime <= endTime) {
                const slotEnd = new Date('1970-01-01T' + currentTime).getTime() + serviceDuration * 60000;
                const slotEndTime = new Date(slotEnd).toTimeString().split(' ')[0];

                if (slotEndTime > endTime) break;

                const isOverlapping = appointments.some(apt => {
                    const aptStart = new Date('1970-01-01T' + apt.appointment_time).getTime();
                    const aptEnd = aptStart + apt.duration * 60000;
                    const slotStart = new Date('1970-01-01T' + currentTime).getTime();
                    
                    return (slotStart < aptEnd && slotEnd > aptStart);
                });

                if (!isOverlapping) {
                    slots.push(currentTime);
                }

                // Tăng thời gian lên 30 phút
                const time = new Date('1970-01-01T' + currentTime).getTime() + 30 * 60000;
                currentTime = new Date(time).toTimeString().split(' ')[0];
            }

            return slots;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Appointment; 