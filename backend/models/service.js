const db = require('../configs/database');

class Service {
    // Lấy tất cả dịch vụ
    static async getAllServices() {
        try {
            const query = 'SELECT * FROM services ORDER BY created_at DESC';
            const [services] = await db.execute(query);
            return services;
        } catch (error) {
            throw error;
        }
    }

    // Lấy dịch vụ theo ID
    static async getServiceById(id) {
        try {
            const query = 'SELECT * FROM services WHERE id = ?';
            const [service] = await db.execute(query, [id]);
            return service[0];
        } catch (error) {
            throw error;
        }
    }

    // Thêm phương thức tạo dịch vụ với danh sách nhân viên
    static async createService(serviceData, employeeIds = []) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Thêm dịch vụ mới
            const [result] = await connection.execute(
                `INSERT INTO services (name, description, duration, price) 
                 VALUES (?, ?, ?, ?)`,
                [
                    serviceData.name,
                    serviceData.description,
                    serviceData.duration,
                    serviceData.price
                ]
            );
            
            const serviceId = result.insertId;
            
            // Thêm mối quan hệ với nhân viên
            if (employeeIds.length > 0) {
                const values = employeeIds.map(empId => [empId, serviceId]);
                const placeholders = values.map(() => '(?, ?)').join(', ');
                
                const params = values.flat();
                
                await connection.execute(
                    `INSERT INTO employee_services (employee_id, service_id) 
                     VALUES ${placeholders}`,
                    params
                );
            }
            
            await connection.commit();
            return serviceId;
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Cập nhật dịch vụ và danh sách nhân viên
    static async updateService(id, serviceData, employeeIds = []) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Cập nhật thông tin dịch vụ
            await connection.execute(
                `UPDATE services 
                 SET name = ?, description = ?, duration = ?, price = ?
                 WHERE id = ?`,
                [
                    serviceData.name,
                    serviceData.description,
                    serviceData.duration,
                    serviceData.price,
                    id
                ]
            );
            
            // Xóa tất cả mối quan hệ hiện tại
            await connection.execute(
                'DELETE FROM employee_services WHERE service_id = ?',
                [id]
            );
            
            // Thêm mối quan hệ mới với nhân viên
            if (employeeIds.length > 0) {
                const values = employeeIds.map(empId => [empId, id]);
                const placeholders = values.map(() => '(?, ?)').join(', ');
                
                const params = values.flat();
                
                await connection.execute(
                    `INSERT INTO employee_services (employee_id, service_id) 
                     VALUES ${placeholders}`,
                    params
                );
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

    // Xóa dịch vụ
    static async deleteService(id) {
        try {
            const query = 'DELETE FROM services WHERE id = ?';
            const [result] = await db.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Lấy danh sách nhân viên có thể thực hiện dịch vụ
    static async getServiceEmployees(serviceId) {
        try {
            const [employees] = await db.execute(
                `SELECT e.* 
                 FROM employees e
                 JOIN employee_services es ON e.id = es.employee_id
                 WHERE es.service_id = ?`,
                [serviceId]
            );
            
            return employees;
        } catch (error) {
            throw error;
        }
    }
    
    // Lấy danh sách dịch vụ mà nhân viên có thể thực hiện
    static async getEmployeeServices(employeeId) {
        try {
            const [services] = await db.execute(
                `SELECT s.* 
                 FROM services s
                 JOIN employee_services es ON s.id = es.service_id
                 WHERE es.employee_id = ?`,
                [employeeId]
            );
            
            return services;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Service; 