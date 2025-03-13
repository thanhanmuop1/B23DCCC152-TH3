import { message } from 'antd';
import { getServices } from '@/services/management/service';

// Hàm lấy danh sách dịch vụ từ API
export const fetchServicesFromAPI = async (setServices, setLoading) => {
  if (setLoading) setLoading(true);
  try {
    const response = await getServices();
    if (response.success) {
      setServices(response.data);
      return response.data;
    } else {
      message.error('Không thể tải danh sách dịch vụ');
      return [];
    }
  } catch (error) {
    console.error('Error fetching services:', error);
    message.error('Lỗi khi tải danh sách dịch vụ');
    return [];
  } finally {
    if (setLoading) setLoading(false);
  }
};

// Hàm lấy dịch vụ theo ID
export const getServiceById = (services, id) => {
  return services.find(svc => svc.id === id);
};

// Hàm tạo options cho Select component
export const getServiceOptions = (services) => {
  return [
    { value: null, label: 'All Services' },
    ...services.map(svc => ({
      value: svc.id,
      label: `${svc.name} (${svc.duration} min - ${svc.price.toLocaleString()}đ)`
    }))
  ];
}; 