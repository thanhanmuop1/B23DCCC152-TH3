import { request } from 'umi';
import { ApiResponse } from './types';

const API_URL = '/api/reviews';

export interface Review {
  id: number;
  appointment_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CreateReviewParams {
  appointment_id: number;
  rating: number;
  comment: string;
}

// Tạo đánh giá mới
export async function createReview(data: CreateReviewParams): Promise<ApiResponse<Review>> {
  return request(API_URL, {
    method: 'POST',
    data,
  });
}

// Lấy đánh giá theo appointment_id
export async function getReviewByAppointment(appointmentId: number): Promise<ApiResponse<Review>> {
  return request(`${API_URL}/appointment/${appointmentId}`, {
    method: 'GET',
  });
}

// Lấy tất cả đánh giá
export async function getAllReviews(params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Review[]>> {
  return request(API_URL, {
    method: 'GET',
    params,
  });
} 