import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { 
  getAvailableSlots, 
  createAppointment 
} from '@/services/management/appointment';
import { getAllServices, getServiceEmployees } from '@/services/management/service';
import { createReview, getReviewByAppointment } from '@/services/management/review';

export interface UserBookingModelState {
  currentStep: number;
  bookingResult: any;
  loading: boolean;
  review: {
    canReview: boolean;
    reviewData: any;
  };
}

export interface UserBookingModelType {
  namespace: 'userBooking';
  state: UserBookingModelState;
  effects: {
    submitBooking: Effect;
    getAvailableSlots: Effect;
    checkReviewStatus: Effect;
    submitReview: Effect;
  };
  reducers: {
    setCurrentStep: Reducer<UserBookingModelState>;
    setBookingResult: Reducer<UserBookingModelState>;
    setLoading: Reducer<UserBookingModelState>;
    setReviewStatus: Reducer<UserBookingModelState>;
  };
}

const UserBookingModel: UserBookingModelType = {
  namespace: 'userBooking',
  state: {
    currentStep: 0,
    bookingResult: null,
    loading: false,
    review: {
      canReview: false,
      reviewData: null,
    },
  },
  effects: {
    *submitBooking({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(createAppointment, payload);
        if (response.success) {
          yield put({ type: 'setBookingResult', payload: response.data });
          yield put({ type: 'setCurrentStep', payload: 1 });
          message.success('Đặt lịch thành công!');
        } else {
          message.error(response.message || 'Đặt lịch thất bại');
        }
      } catch (error) {
        message.error('Có lỗi xảy ra khi đặt lịch');
      }
      yield put({ type: 'setLoading', payload: false });
    },

    *checkReviewStatus({ payload: appointmentId }, { call, put }) {
      try {
        const response = yield call(getReviewByAppointment, appointmentId);
        yield put({
          type: 'setReviewStatus',
          payload: {
            canReview: !response.data,
            reviewData: response.data,
          },
        });
      } catch (error) {
        console.error('Error checking review status:', error);
      }
    },

    *submitReview({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(createReview, payload);
        if (response.success) {
          message.success('Cảm ơn bạn đã đánh giá!');
          yield put({ type: 'setCurrentStep', payload: 2 });
        } else {
          message.error('Không thể gửi đánh giá');
        }
      } catch (error) {
        message.error('Có lỗi xảy ra khi gửi đánh giá');
      }
      yield put({ type: 'setLoading', payload: false });
    },
  },
  reducers: {
    setCurrentStep(state, { payload }) {
      return { ...state, currentStep: payload };
    },
    setBookingResult(state, { payload }) {
      return { ...state, bookingResult: payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
    setReviewStatus(state, { payload }) {
      return {
        ...state,
        review: payload,
      };
    },
  },
};

export default UserBookingModel; 