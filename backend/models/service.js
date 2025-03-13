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

    // Tạo dịch vụ mới
    static async createService(serviceData) {
        try {
            const query = `
                INSERT INTO services (name, description, price, duration)
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await db.execute(query, [
                serviceData.name,
                serviceData.description,
                serviceData.price,
                serviceData.duration
            ]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật dịch vụ
    static async updateService(id, serviceData) {
        try {
            const query = `
                UPDATE services
                SET name = ?, description = ?, price = ?, duration = ?
                WHERE id = ?
            `;
            const [result] = await db.execute(query, [
                serviceData.name,
                serviceData.description,
                serviceData.price,
                serviceData.duration,
                id
            ]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
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
}

module.exports = Service; 