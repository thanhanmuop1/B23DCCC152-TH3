import { request } from 'umi';

const API_URL = 'http://localhost:3000/api';

export async function getEmployees() {
  return request(`${API_URL}/employees`, {
    method: 'GET',
  });
}

export async function getEmployeeById(id) {
  return request(`${API_URL}/employees/${id}`, {
    method: 'GET',
  });
}

export async function createEmployee(data) {
  return request(`${API_URL}/employees`, {
    method: 'POST',
    data,
  });
}

export async function updateEmployee(id, data) {
  return request(`${API_URL}/employees/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteEmployee(id) {
  return request(`${API_URL}/employees/${id}`, {
    method: 'DELETE',
  });
} 