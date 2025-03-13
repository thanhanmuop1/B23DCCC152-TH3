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

// Hàm lấy danh sách nhân viên từ API
export const fetchEmployeesFromAPI = async (setEmployees, setLoading) => {
  if (setLoading) setLoading(true);
  try {
    // Trong bài tập thực tế, bạn sẽ gọi API ở đây
    // const response = await getEmployees();
    
    // Dữ liệu mẫu
    const employees = [
      { id: 1, name: 'Thành', phone: '0337963055', max_customers_per_day: 5 },
      { id: 2, name: 'John Doe', phone: '0123456789', max_customers_per_day: 8 },
      { id: 3, name: 'Jane Smith', phone: '0987654321', max_customers_per_day: 6 },
    ];
    
    setEmployees(employees);
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    message.error('Lỗi khi tải danh sách nhân viên');
    return [];
  } finally {
    if (setLoading) setLoading(false);
  }
};

// Hàm lấy nhân viên theo ID
export const getEmployeeById = (employees, id) => {
  return employees.find(emp => emp.id === id);
};

// Hàm tạo options cho Select component
export const getEmployeeOptions = (employees) => {
  return [
    { value: null, label: 'All Employees' },
    ...employees.map(emp => ({
      value: emp.id,
      label: emp.name
    }))
  ];
}; 