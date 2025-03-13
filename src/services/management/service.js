import { request } from 'umi';

const API_URL = 'http://localhost:3000/api';

// Lấy danh sách dịch vụ
export async function getServices(params) {
  return request(`${API_URL}/services`, {
    method: 'GET',
    params,
  });
}

// Tạo dịch vụ mới
export async function createService(data) {
  return request(`${API_URL}/services`, {
    method: 'POST',
    data,
  });
}

// Cập nhật dịch vụ
export async function updateService(id, data) {
  return request(`${API_URL}/services/${id}`, {
    method: 'PUT',
    data,
  });
}

// Xóa dịch vụ
export async function deleteService(id) {
  return request(`${API_URL}/services/${id}`, {
    method: 'DELETE',
  });
}
