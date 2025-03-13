import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { 
  getAllServices, 
  getServiceById, 
  createService, 
  updateService, 
  deleteService,
  getServiceEmployees,
  Service,
  ServiceWithEmployees
} from '@/services/management/service';
import { getAllEmployees, Employee } from '@/services/management/employee';

export interface ServiceModelState {
  services: ServiceWithEmployees[];
  currentService: ServiceWithEmployees | null;
  employees: Employee[];
  loading: boolean;
  modalVisible: boolean;
}

export interface ServiceModelType {
  namespace: 'service';
  state: ServiceModelState;
  effects: {
    fetchServices: Effect;
    fetchServiceById: Effect;
    createService: Effect;
    updateService: Effect;
    removeService: Effect;
    fetchEmployees: Effect;
  };
  reducers: {
    setServices: Reducer<ServiceModelState>;
    setCurrentService: Reducer<ServiceModelState>;
    setEmployees: Reducer<ServiceModelState>;
    setLoading: Reducer<ServiceModelState>;
    setModalVisible: Reducer<ServiceModelState>;
  };
}

const ServiceModel: ServiceModelType = {
  namespace: 'service',
  state: {
    services: [],
    currentService: null,
    employees: [],
    loading: false,
    modalVisible: false,
  },
  effects: {
    *fetchServices(_, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(getAllServices);
        if (response.success) {
          // Fetch employees for each service
          const servicesWithEmployees = yield Promise.all(
            response.data.map(async (service: Service) => {
              const employeesResponse = await getServiceEmployees(service.id);
              return {
                ...service,
                employees: employeesResponse.success ? employeesResponse.data : [],
              };
            })
          );
          yield put({ type: 'setServices', payload: servicesWithEmployees });
        } else {
          message.error(response.message || 'Lỗi khi lấy danh sách dịch vụ');
        }
      } catch (error) {
        message.error('Lỗi kết nối đến server');
      }
      yield put({ type: 'setLoading', payload: false });
    },
    
    *fetchServiceById({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(getServiceById, payload);
        if (response.success) {
          const employeesResponse = yield call(getServiceEmployees, payload);
          yield put({ 
            type: 'setCurrentService', 
            payload: {
              ...response.data,
              employees: employeesResponse.success ? employeesResponse.data : [],
            }
          });
        } else {
          message.error(response.message || 'Lỗi khi lấy thông tin dịch vụ');
        }
      } catch (error) {
        message.error('Lỗi kết nối đến server');
      }
      yield put({ type: 'setLoading', payload: false });
    },
    
    *createService({ payload, callback }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { employee_ids, ...serviceData } = payload;
        const response = yield call(createService, serviceData, employee_ids);
        if (response.success) {
          message.success('Thêm dịch vụ thành công');
          yield put({ type: 'fetchServices' });
          yield put({ type: 'setModalVisible', payload: false });
          if (callback) callback();
        } else {
          message.error(response.message || 'Lỗi khi thêm dịch vụ');
        }
      } catch (error) {
        message.error('Lỗi kết nối đến server');
      }
      yield put({ type: 'setLoading', payload: false });
    },
    
    *updateService({ payload, callback }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { id, employee_ids, ...serviceData } = payload;
        const response = yield call(updateService, id, serviceData, employee_ids);
        if (response.success) {
          message.success('Cập nhật dịch vụ thành công');
          yield put({ type: 'fetchServices' });
          yield put({ type: 'setModalVisible', payload: false });
          if (callback) callback();
        } else {
          message.error(response.message || 'Lỗi khi cập nhật dịch vụ');
        }
      } catch (error) {
        message.error('Lỗi kết nối đến server');
      }
      yield put({ type: 'setLoading', payload: false });
    },
    
    *removeService({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(deleteService, payload);
        if (response.success) {
          message.success('Xóa dịch vụ thành công');
          yield put({ type: 'fetchServices' });
        } else {
          message.error(response.message || 'Lỗi khi xóa dịch vụ');
        }
      } catch (error) {
        message.error('Lỗi kết nối đến server');
      }
      yield put({ type: 'setLoading', payload: false });
    },
    
    *fetchEmployees(_, { call, put }) {
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
    },
  },
  reducers: {
    setServices(state, { payload }) {
      return { ...state, services: payload };
    },
    setCurrentService(state, { payload }) {
      return { ...state, currentService: payload };
    },
    setEmployees(state, { payload }) {
      return { ...state, employees: payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
    setModalVisible(state, { payload }) {
      return { ...state, modalVisible: payload };
    },
  },
};

export default ServiceModel; 