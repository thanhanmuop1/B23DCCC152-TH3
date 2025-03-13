import { Dispatch, SetStateAction } from 'react';
import { ApiResponse } from '@/services/management/types';
import { Moment } from 'moment';
import { SelectProps } from 'antd/lib/select';

export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

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
  isView?: boolean;
}

export interface Rating {
  id: number;
  appointment_id: number;
  rating: number;
  comment?: string;
  customer_name: string;
  service_name: string;
  employee_name: string;
  created_at: string;
}

export interface RatingStats {
  ratings: Rating[];
  total: number;
  average_rating: number;
  current_page: number;
  total_pages: number;
}

export interface AppointmentFilters {
  employeeId?: number;
  serviceId?: number;
  date?: string;
  status?: string;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
}

export type SetState<T> = Dispatch<SetStateAction<T>>;

export interface Appointment {
  id: number;
  customer_name: string;
  customer_phone: string;
  service_id: number;
  employee_id: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  service_name?: string;
  employee_name?: string;
}

export interface BookingFilters {
  employeeId: number | null;
  serviceId: number | null;
  date: string;
}

export interface StatusConfig {
  tag: string;
  text: string;
}

export interface BookingState {
  appointments: Appointment[];
  employees: Employee[];
  services: Service[];
  loading: boolean;
  currentDate: Moment;
  activeView: 'calendar' | 'list';
  calendarView: 'day' | 'week' | 'month';
  modalVisible: boolean;
  availableSlots: TimeSlot[];
  slotsLoading: boolean;
  filters: BookingFilters;
}

export interface CalendarViewType {
  day: 'day';
  week: 'week';
  month: 'month';
} 