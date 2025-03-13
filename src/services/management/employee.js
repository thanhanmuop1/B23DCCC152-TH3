import { request } from 'umi';

const API_URL = 'http://localhost:3000/api';

// Lấy danh sách nhân viên
export async function getEmployees(params) {
  return request(`${API_URL}/employees`, {
    method: 'GET',
    params,
  });
}

// Tạo nhân viên mới
export async function createEmployee(data) {
  return request(`${API_URL}/employees`, {
    method: 'POST',
    data,
  });
}

// Cập nhật nhân viên
export async function updateEmployee(id, data) {
  return request(`${API_URL}/employees/${id}`, {
    method: 'PUT',
    data,
  });
}

// Xóa nhân viên
export async function deleteEmployee(id) {
  return request(`${API_URL}/employees/${id}`, {
    method: 'DELETE',
  });
} 