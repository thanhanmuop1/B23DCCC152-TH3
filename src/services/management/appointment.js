import { request } from 'umi';

const API_URL = 'http://localhost:3000/api';
// Hàm lấy danh sách lịch hẹn
export async function getAppointments(params) {
  return request(`${API_URL}/appointments`, {
    method: 'GET',
    params,
  });
}

// Hàm tạo lịch hẹn mới
export async function createAppointment(data) {
  return request(`${API_URL}/appointments`, {
    method: 'POST',
    data,
  });
}

// Hàm cập nhật trạng thái lịch hẹn
export async function updateAppointmentStatus(id, status) {
  return request(`${API_URL}/appointments/${id}/status`, {
    method: 'PUT',
    data: { status },
  });
}

// Hàm lấy danh sách slot trống
export async function getAvailableSlots(params) {
  return request(`${API_URL}/appointments/available-slots`, {
    method: 'GET',
    params,
  });
} 