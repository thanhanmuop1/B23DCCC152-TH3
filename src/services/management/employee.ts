import { request } from 'umi';
import { ApiResponse } from './types';

const API_URL = 'http://localhost:3000/api/employees';

export interface Employee {
  id: number;
  name: string;
  phone: string;
  email?: string;
  max_customers_per_day: number;
  current_customers?: number;
  start_time?: string;
  end_time?: string;
  work_days?: string;
  created_at?: string;
}

export async function getAllEmployees(): Promise<ApiResponse<Employee[]>> {
  return request(API_URL, {
    method: 'GET',
  });
}

export async function getEmployeeById(id: number): Promise<ApiResponse<Employee>> {
  return request(`${API_URL}/${id}`, {
    method: 'GET',
  });
}

export async function createEmployee(data: Omit<Employee, 'id'>): Promise<ApiResponse<{ id: number }>> {
  return request(API_URL, {
    method: 'POST',
    data,
  });
}

export async function updateEmployee(id: number, data: Partial<Employee>): Promise<ApiResponse<any>> {
  return request(`${API_URL}/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteEmployee(id: number): Promise<ApiResponse<any>> {
  return request(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
}

export async function getEmployeeServices(id: number): Promise<ApiResponse<any[]>> {
  return request(`${API_URL}/${id}/services`, {
    method: 'GET',
  });
}