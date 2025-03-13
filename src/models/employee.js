import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '@/services/management/employee';
import { message } from 'antd';

export default {
  namespace: 'employee',
  
  state: {
    employees: [],
    loading: false,
    currentEmployee: null,
  },
  
  effects: {
    *fetchEmployees(_, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(getEmployees);
        if (response.success) {
          yield put({ type: 'saveEmployees', payload: response.data });
        } else {
          message.error('Không thể tải danh sách nhân viên');
        }
      } catch (error) {
        message.error('Lỗi khi tải danh sách nhân viên');
        console.error(error);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    
    *addEmployee({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(createEmployee, payload);
        if (response.success) {
          message.success('Thêm nhân viên thành công');
          yield put({ type: 'fetchEmployees' });
        } else {
          message.error('Không thể thêm nhân viên');
        }
      } catch (error) {
        message.error('Lỗi khi thêm nhân viên');
        console.error(error);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    
    *updateEmployee({ payload }, { call, put }) {
      const { id, data } = payload;
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(updateEmployee, id, data);
        if (response.success) {
          message.success('Cập nhật nhân viên thành công');
          yield put({ type: 'fetchEmployees' });
        } else {
          message.error('Không thể cập nhật nhân viên');
        }
      } catch (error) {
        message.error('Lỗi khi cập nhật nhân viên');
        console.error(error);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    
    *removeEmployee({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(deleteEmployee, payload);
        if (response.success) {
          message.success('Xóa nhân viên thành công');
          yield put({ type: 'fetchEmployees' });
        } else {
          message.error('Không thể xóa nhân viên');
        }
      } catch (error) {
        message.error('Lỗi khi xóa nhân viên');
        console.error(error);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
  },
  
  reducers: {
    saveEmployees(state, { payload }) {
      return { ...state, employees: payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
    setCurrentEmployee(state, { payload }) {
      return { ...state, currentEmployee: payload };
    },
  },
}; 