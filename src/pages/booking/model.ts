import { Effect, Reducer } from 'umi';
import { getAppointments, createAppointment, updateAppointmentStatus, getAvailableSlots } from '@/services/management/appointment';
import moment from 'moment';
import { message } from 'antd';

export interface AppointmentData {
  id: number;
  customer_name: string;
  customer_phone: string;
  employee_id: number;
  service_id: number;
  appointment_date: string;
  appointment_time: string;
  end_time: string;
  status: string;
  created_at: string;
  employee_name: string;
  employee_phone: string;
  max_customers_per_day: number;
  service_name: string;
  service_duration: number;
  service_price: string;
}

export interface AvailableSlot {
  start_time: string;
  end_time: string;
}

export interface BookingModelState {
  appointments: AppointmentData[];
  loading: boolean;
  viewMode: 'calendar' | 'list';
  currentDate: string;
  selectedDate: string;
  availableSlots: AvailableSlot[];
  filters: {
    employee_id?: number;
    service_id?: number;
    status?: string;
    from_date?: string;
    to_date?: string;
    customer_phone?: string;
  };
}

export interface BookingModelType {
  namespace: 'booking';
  state: BookingModelState;
  effects: {
    fetchAppointments: Effect;
    createNewAppointment: Effect;
    updateStatus: Effect;
    fetchAvailableSlots: Effect;
    changeDate: Effect;
    updateAppointmentStatus: Effect;
  };
  reducers: {
    setAppointments: Reducer<BookingModelState>;
    setViewMode: Reducer<BookingModelState>;
    setFilters: Reducer<BookingModelState>;
    setLoading: Reducer<BookingModelState>;
    setCurrentDate: Reducer<BookingModelState>;
    setSelectedDate: Reducer<BookingModelState>;
    setAvailableSlots: Reducer<BookingModelState>;
  };
}

const BookingModel: BookingModelType = {
  namespace: 'booking',
  state: {
    appointments: [],
    loading: false,
    viewMode: 'calendar',
    currentDate: moment().format('YYYY-MM-DD'),
    selectedDate: moment().format('YYYY-MM-DD'),
    availableSlots: [],
    filters: {},
  },
  effects: {
    *fetchAppointments({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      
      const state = yield select(state => state.booking);
      const params = {
        ...state.filters,
        ...payload,
      };
      
      const response = yield call(getAppointments, params);
      if (response && response.success) {
        yield put({ type: 'setAppointments', payload: response.data });
      }
      yield put({ type: 'setLoading', payload: false });
    },
    
    *createNewAppointment({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const response = yield call(createAppointment, payload);
      yield put({ type: 'fetchAppointments' });
      yield put({ type: 'setLoading', payload: false });
      return response;
    },
    
    *updateStatus({ payload: { id, status } }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const response = yield call(updateAppointmentStatus, id, status);
      yield put({ type: 'fetchAppointments' });
      yield put({ type: 'setLoading', payload: false });
      return response;
    },
    
    *fetchAvailableSlots({ payload }, { call, put, select }) {
      const state = yield select(state => state.booking);
      const params = {
        date: state.selectedDate,
        ...payload,
      };
      
      const response = yield call(getAvailableSlots, params);
      if (response && response.success) {
        yield put({ type: 'setAvailableSlots', payload: response.data });
      }
      return response;
    },
    
    *changeDate({ payload }, { put }) {
      yield put({ type: 'setSelectedDate', payload });
      yield put({ 
        type: 'fetchAppointments',
        payload: {
          from_date: payload,
          to_date: payload
        }
      });
    },
    
    *updateAppointmentStatus({ payload }, { call, put }) {
      const { id, status } = payload;
      yield put({ type: 'setLoading', payload: true });
      
      try {
        const response = yield call(updateAppointmentStatus, id, status);
        
        if (response.success) {
          message.success(`Lịch hẹn đã được cập nhật thành ${status === 'completed' ? 'hoàn thành' : status}`);
          
          // Refresh danh sách lịch hẹn
          yield put({ type: 'fetchAppointments' });
          
          return response;
        } else {
          message.error(response.message || 'Không thể cập nhật trạng thái lịch hẹn');
        }
      } catch (error) {
        console.error('Error updating appointment status:', error);
        message.error('Lỗi khi cập nhật trạng thái lịch hẹn');
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
  },
  reducers: {
    setAppointments(state, { payload }) {
      return { ...state, appointments: payload };
    },
    setViewMode(state, { payload }) {
      return { ...state, viewMode: payload };
    },
    setFilters(state, { payload }) {
      return { ...state, filters: { ...state.filters, ...payload } };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
    setCurrentDate(state, { payload }) {
      return { ...state, currentDate: payload };
    },
    setSelectedDate(state, { payload }) {
      return { ...state, selectedDate: payload };
    },
    setAvailableSlots(state, { payload }) {
      return { ...state, availableSlots: payload };
    },
  },
};

export default BookingModel; 