import { request } from 'umi';
import { ApiResponse } from './types';

const API_URL = 'http://localhost:3000/api/statistics';

export interface DashboardStats {
  today: {
    total_appointments: number;
    completed: number;
    revenue: string;
  };
  month: {
    total_appointments: number;
    completed: number;
    revenue: string;
  };
}

export interface AppointmentDailyStats {
  date: string;
  total_appointments: number;
  completed: number;
  canceled: number;
  pending: number;
}

export interface AppointmentMonthlyStats {
  month: number;
  total_appointments: number;
  completed: number;
  canceled: number;
  pending: number;
}

export interface ServiceRevenueStats {
  service_id: number;
  service_name: string;
  total_appointments: number;
  completed_appointments: number;
  total_revenue: string;
}

export interface EmployeeRevenueStats {
  employee_id: number;
  employee_name: string;
  total_appointments: number;
  completed_appointments: number;
  total_revenue: string;
}

interface DateRange {
  start_date: string;
  end_date: string;
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return request(`${API_URL}/dashboard`, {
    method: 'GET',
  });
}

export async function getAppointmentsByDay(
  params: DateRange
): Promise<ApiResponse<AppointmentDailyStats[]>> {
  return request(`${API_URL}/appointments/daily`, {
    method: 'GET',
    params,
  });
}

export async function getAppointmentsByMonth(
  params: { year: number }
): Promise<ApiResponse<AppointmentMonthlyStats[]>> {
  return request(`${API_URL}/appointments/monthly`, {
    method: 'GET',
    params,
  });
}

export async function getRevenueByService(
  params: DateRange
): Promise<ApiResponse<ServiceRevenueStats[]>> {
  return request(`${API_URL}/revenue/services`, {
    method: 'GET',
    params,
  });
}

export async function getRevenueByEmployee(
  params: DateRange
): Promise<ApiResponse<EmployeeRevenueStats[]>> {
  return request(`${API_URL}/revenue/employees`, {
    method: 'GET',
    params,
  });
}