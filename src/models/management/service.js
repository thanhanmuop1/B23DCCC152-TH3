import { message } from 'antd';

// Hàm lấy danh sách dịch vụ từ API
export const fetchServicesFromAPI = async (setServices, setLoading) => {
  if (setLoading) setLoading(true);
  try {
    // Trong bài tập thực tế, bạn sẽ gọi API ở đây
    // const response = await getServices();
    
    // Dữ liệu mẫu
    const services = [
      { id: 1, name: 'Gội đầu', duration: 30, price: 10000 },
      { id: 2, name: 'Cắt tóc', duration: 45, price: 100000 },
      { id: 3, name: 'Uốn tóc', duration: 120, price: 500000 },
      { id: 4, name: 'Nhuộm tóc', duration: 90, price: 400000 },
    ];
    
    setServices(services);
    return services;
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