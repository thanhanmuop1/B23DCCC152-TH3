import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { 
  getAllEmployees, 
  getEmployeeById, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee 
} from '@/services/management/employee';
import { Employee } from '@/services/management/employee';

export interface EmployeeModelState {
  employees: Employee[];
  currentEmployee: Employee | null;
  loading: boolean;
}

export interface EmployeeModelType {
  namespace: 'employee';
  state: EmployeeModelState;
  effects: {
    fetchEmployees: Effect;
    fetchEmployeeById: Effect;
    createEmployee: Effect;
    updateEmployee: Effect;
    removeEmployee: Effect;
  };
  reducers: {
    setEmployees: Reducer<EmployeeModelState>;
    setCurrentEmployee: Reducer<EmployeeModelState>;
    setLoading: Reducer<EmployeeModelState>;
  };
}

const EmployeeModel: EmployeeModelType = {
  namespace: 'employee',
  state: {
    employees: [],
    currentEmployee: null,
    loading: false,
  },
  effects: {
    *fetchEmployees(_, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(getAllEmployees);
        if (response.success) {
          yield put({ type: 'setEmployees', payload: response.data });
        } else {
          message.error(response.message || 'Lỗi khi lấy danh sách nhân viên');
        }
      } catch (error) {
        message.error('Lỗi kết nối đến server');
      }
      yield put({ type: 'setLoading', payload: false });
    },
    
    *fetchEmployeeById({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(getEmployeeById, payload);
        if (response.success) {
          yield put({ type: 'setCurrentEmployee', payload: response.data });
        } else {
          message.error(response.message || 'Lỗi khi lấy thông tin nhân viên');
        }
      } catch (error) {
        message.error('Lỗi kết nối đến server');
      }
      yield put({ type: 'setLoading', payload: false });
    },
    
    *createEmployee({ payload, callback }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(createEmployee, payload);
        if (response.success) {
          message.success('Thêm nhân viên thành công');
          if (callback) callback();
        } else {
          message.error(response.message || 'Lỗi khi thêm nhân viên');
        }
      } catch (error) {
        message.error('Lỗi kết nối đến server');
      }
      yield put({ type: 'setLoading', payload: false });
    },
    
    *updateEmployee({ payload, callback }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { id, ...data } = payload;
        const response = yield call(updateEmployee, id, data);
        if (response.success) {
          message.success('Cập nhật nhân viên thành công');
          if (callback) callback();
        } else {
          message.error(response.message || 'Lỗi khi cập nhật nhân viên');
        }
      } catch (error) {
        message.error('Lỗi kết nối đến server');
      }
      yield put({ type: 'setLoading', payload: false });
    },
    
    *removeEmployee({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(deleteEmployee, payload);
        if (response.success) {
          message.success('Xóa nhân viên thành công');
          yield put({ type: 'fetchEmployees' });
        } else {
          message.error(response.message || 'Lỗi khi xóa nhân viên');
        }
      } catch (error) {
        message.error('Lỗi kết nối đến server');
      }
      yield put({ type: 'setLoading', payload: false });
    },
  },
  reducers: {
    setEmployees(state, { payload }) {
      return { ...state, employees: payload };
    },
    setCurrentEmployee(state, { payload }) {
      return { ...state, currentEmployee: payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
  },
};

export default EmployeeModel; 