export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
}

export interface Employee {
  id: number;
  name: string;
  phone: string;
  email?: string;
  max_customers_per_day: number;
  work_days: string;
}

export interface Rating {
  id: number;
  appointment_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  customer_name: string;
  service_name: string;
  employee_name: string;
}

export interface RatingStats {
  ratings: Rating[];
  total: number;
  average_rating: number;
  current_page: number;
  total_pages: number;
}

export interface Appointment {
  id: number;
  customer_name: string;
  customer_phone: string;
  service_id: number;
  employee_id: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

export interface Statistics {
  [key: string]: any;
}

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>; 