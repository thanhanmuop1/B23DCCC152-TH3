import { request } from 'umi';
import { ApiResponse } from './types';

const API_URL = 'http://localhost:3000/api/services';

export interface Service {
  id: number;
  name: string;
  description?: string;
  duration: number;
  price: string;
  created_at?: string;
}

export interface ServiceWithEmployees extends Service {
  employees?: { id: number; name: string }[];
}

export async function getAllServices(): Promise<ApiResponse<Service[]>> {
  return request(API_URL, {
    method: 'GET',
  });
}

export async function getServiceById(id: number): Promise<ApiResponse<Service>> {
  return request(`${API_URL}/${id}`, {
    method: 'GET',
  });
}

export async function createService(
  data: Omit<Service, 'id'>,
  employee_ids: number[]
): Promise<ApiResponse<{ id: number }>> {
  return request(API_URL, {
    method: 'POST',
    data: {
      ...data,
      employee_ids,
    },
  });
}

export async function updateService(
  id: number,
  data: Partial<Service>,
  employee_ids: number[]
): Promise<ApiResponse<any>> {
  return request(`${API_URL}/${id}`, {
    method: 'PUT',
    data: {
      ...data,
      employee_ids,
    },
  });
}

export async function deleteService(id: number): Promise<ApiResponse<any>> {
  return request(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
}

export async function getServiceEmployees(id: number): Promise<ApiResponse<any[]>> {
  return request(`${API_URL}/${id}/employees`, {
    method: 'GET',
  });
}

export async function getEmployeeServices(employeeId: number): Promise<ApiResponse<Service[]>> {
  return request(`/api/employees/${employeeId}/services`, {
    method: 'GET',
  });
} 