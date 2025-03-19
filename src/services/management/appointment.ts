import { request } from 'umi';
import { ApiResponse } from './types';
import { AppointmentData, AvailableSlot } from '@/pages/booking/model';

const API_URL = 'http://localhost:3000/api/appointments';

interface AppointmentFilters {
  employee_id?: number;
  service_id?: number;
  from_date?: string;
  to_date?: string;
  status?: string;
  customer_phone?: string;
}

export async function getAppointments(
  params: AppointmentFilters
): Promise<ApiResponse<AppointmentData[]>> {
  return request(API_URL, {
    method: 'GET',
    params,
  });
}

export async function createAppointment(
  data: {
    customer_name: string;
    customer_phone: string;
    employee_id: number;
    service_id: number;
    appointment_date: string;
    appointment_time: string;
  }
): Promise<ApiResponse<{ id: number }>> {
  return request(API_URL, {
    method: 'POST',
    data,
  });
}

export async function updateAppointmentStatus(
  id: number,
  status: string
): Promise<ApiResponse<any>> {
  return request(`${API_URL}/${id}/status`, {
    method: 'PUT',
    data: { status },
  });
}

export async function getAppointmentById(
  id: number
): Promise<ApiResponse<any>> {
  return request(`${API_URL}/${id}`, {
    method: 'GET',
  });
}

export async function getAvailableSlots(params: {
  service_id: number;
  employee_id: number;
  date: string;
}): Promise<ApiResponse<AvailableSlot[]>> {
  return request(`${API_URL}/available-slots`, {
    method: 'GET',
    params,
  });
} 