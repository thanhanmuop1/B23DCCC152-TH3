import { request } from 'umi';
import { ApiResponse, Rating, RatingStats, PaginationParams } from './types';
import { getAppointmentById as fetchAppointment } from '@/services/management/appointment';

const API_URL = 'http://localhost:3000/api/ratings';

export async function createRating(data: {
  appointment_id: number;
  rating: number;
  comment?: string;
}): Promise<ApiResponse<Rating>> {
  return request(API_URL, {
    method: 'POST',
    data,
  });
}

export async function getRatingByAppointment(appointmentId: number): Promise<ApiResponse<Rating>> {
  return request(`${API_URL}/appointment/${appointmentId}`, {
    method: 'GET',
  });
}

export async function getRatingsByService(
  serviceId: number,
  params: PaginationParams
): Promise<ApiResponse<RatingStats>> {
  return request(`${API_URL}/service/${serviceId}`, {
    method: 'GET',
    params,
  });
}

export async function getRatingsByEmployee(
  employeeId: number,
  params: PaginationParams
): Promise<ApiResponse<RatingStats>> {
  return request(`${API_URL}/employee/${employeeId}`, {
    method: 'GET',
    params,
  });
}

// Export lại hàm getAppointmentById từ appointment service
export const getAppointmentById = fetchAppointment; 