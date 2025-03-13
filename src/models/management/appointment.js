import { 
  getAppointments, 
  createAppointment, 
  updateAppointmentStatus, 
  getAvailableSlots 
} from '@/services/management/appointment';
import { message } from 'antd';
import moment from 'moment';

// Hàm lấy danh sách lịch hẹn
export const fetchAppointments = async (filters, setAppointments, setLoading) => {
  setLoading(true);
  try {
    const params = {
      employee_id: filters.employeeId,
      service_id: filters.serviceId,
      from_date: filters.date,
      to_date: filters.date,
    };
    
    const response = await getAppointments(params);
    if (response.success) {
      setAppointments(response.data);
    } else {
      message.error('Không thể tải danh sách lịch hẹn');
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    message.error('Lỗi khi tải danh sách lịch hẹn');
  } finally {
    setLoading(false);
  }
};

// Hàm lấy danh sách slot trống
export const fetchAvailableSlots = async (employeeId, date, serviceId, setAvailableSlots, setSlotsLoading) => {
  if (!employeeId || !date || !serviceId) {
    console.log('Missing required params:', { employeeId, date, serviceId }); // Để debug
    return;
  }
  
  try {
    const params = {
      employee_id: employeeId,
      date: typeof date === 'string' ? date : moment(date).format('YYYY-MM-DD'),
      service_id: serviceId,
    };
    
    console.log('Fetching slots with params:', params); // Để debug
    
    const response = await getAvailableSlots(params);
    console.log('API Response:', response); // Để debug
    
    if (response && response.success) {
      const formattedSlots = response.data.map(slot => ({
        start_time: slot.start_time,
        end_time: slot.end_time
      }));
      setAvailableSlots(formattedSlots);
      return formattedSlots;
    } else {
      message.error('Không thể tải danh sách slot trống');
      setAvailableSlots([]);
      return [];
    }
  } catch (error) {
    console.error('Error fetching available slots:', error);
    message.error('Lỗi khi tải danh sách slot trống');
    setAvailableSlots([]);
    return [];
  }
};

// Hàm tạo lịch hẹn mới
export const createNewAppointment = async (values, setLoading, setModalVisible, fetchAppointmentsCallback) => {
  setLoading(true);
  try {
    const response = await createAppointment(values);
    if (response.success) {
      message.success('Đặt lịch hẹn thành công');
      setModalVisible(false);
      fetchAppointmentsCallback();
      return true;
    } else {
      message.error(response.message || 'Không thể đặt lịch hẹn');
      return false;
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    message.error('Lỗi khi đặt lịch hẹn');
    return false;
  } finally {
    setLoading(false);
  }
};

// Hàm cập nhật trạng thái lịch hẹn
export const updateStatus = async (id, status, setLoading, fetchAppointmentsCallback) => {
  setLoading(true);
  try {
    const response = await updateAppointmentStatus(id, status);
    if (response.success) {
      message.success('Cập nhật trạng thái thành công');
      fetchAppointmentsCallback();
      return true;
    } else {
      message.error('Không thể cập nhật trạng thái');
      return false;
    }
  } catch (error) {
    console.error('Error updating status:', error);
    message.error('Lỗi khi cập nhật trạng thái');
    return false;
  } finally {
    setLoading(false);
  }
};

// Các hàm tiện ích
export const formatTime = (time) => {
  return moment(time, 'HH:mm:ss').format('HH:mm');
};

export const getStatusTag = (status) => {
  switch (status) {
    case 'pending':
      return 'orange';
    case 'confirmed':
      return 'blue';
    case 'completed':
      return 'green';
    case 'canceled':
      return 'red';
    default:
      return 'default';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'confirmed':
      return 'Đã xác nhận';
    case 'completed':
      return 'Hoàn thành';
    case 'canceled':
      return 'Đã hủy';
    default:
      return 'Chờ xác nhận';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return '#1890ff';
    case 'completed':
      return '#52c41a';
    case 'canceled':
      return '#f5222d';
    default:
      return '#faad14';
  }
};

// Hàm tạo các khung giờ từ 8:00 đến 19:00
export const generateTimeSlots = () => {
  const timeSlots = [];
  for (let hour = 8; hour < 20; hour++) {
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    timeSlots.push(`${formattedHour}:00 AM`);
  }
  return timeSlots;
};

// Hàm lấy lịch hẹn theo giờ
export const getAppointmentsForHour = (appointments, hour) => {
  const hourStart = `${hour}:00:00`;
  const hourEnd = `${hour}:59:59`;
  
  return appointments.filter(app => {
    const appTime = app.appointment_time;
    return appTime >= hourStart && appTime <= hourEnd;
  });
}; 