import { message } from 'antd';
import * as ratingService from '@/services/management/ratings';
import * as employeeService from '@/services/management/employee';
import * as serviceService from '@/services/management/service';
import { Service, Employee, RatingStats, SetState } from './types';
import { getAppointmentById, getRatingByAppointment } from '@/services/management/ratings';

export const fetchOptionsData = async (
  setServices: SetState<Service[]>,
  setEmployees: SetState<Employee[]>,
  setOptionsLoading: SetState<boolean>
): Promise<{
  services: Service[];
  employees: Employee[];
}> => {
  setOptionsLoading(true);
  try {
    const [servicesRes, employeesRes] = await Promise.all([
      serviceService.getAllServices(),
      employeeService.getAllEmployees()
    ]);

    if (servicesRes.success) {
      setServices(servicesRes.data);
    } else {
      message.error('Không thể tải danh sách dịch vụ');
    }

    if (employeesRes.success) {
      setEmployees(employeesRes.data);
    } else {
      message.error('Không thể tải danh sách nhân viên');
    }

    return {
      services: servicesRes.success ? servicesRes.data : [],
      employees: employeesRes.success ? employeesRes.data : []
    };
  } catch (error) {
    console.error('Error fetching options:', error);
    message.error('Lỗi khi tải danh sách dịch vụ và nhân viên');
    return { services: [], employees: [] };
  } finally {
    setOptionsLoading(false);
  }
};

export const fetchRatingData = async (
  activeTab: 'service' | 'employee',
  selectedId: number,
  page: number,
  pageSize: number,
  setData: SetState<RatingStats>,
  setLoading: SetState<boolean>
): Promise<RatingStats | null> => {
  if (!selectedId) return null;
  
  setLoading(true);
  try {
    const response = activeTab === 'service' 
      ? await ratingService.getRatingsByService(selectedId, { page, limit: pageSize })
      : await ratingService.getRatingsByEmployee(selectedId, { page, limit: pageSize });

    if (response.success) {
      setData(response.data);
      return response.data;
    } else {
      message.error('Không thể tải đánh giá');
      return null;
    }
  } catch (error) {
    console.error('Error fetching ratings:', error);
    message.error('Lỗi khi tải đánh giá');
    return null;
  } finally {
    setLoading(false);
  }
};

export const formatServiceOptions = (services: Service[]) => 
  services.map(service => ({
    label: service.name,
    value: service.id
  }));

export const formatEmployeeOptions = (employees: Employee[]) => 
  employees.map(employee => ({
    label: employee.name,
    value: employee.id
  }));

// Thêm interface cho dữ liệu đánh giá
export interface RatingSubmitData {
  appointment_id: number;
  service_id: number;
  employee_id: number;
  rating: number;
  comment: string;
}

// Thêm hàm submit đánh giá
export const submitRating = async (
  data: RatingSubmitData,
  setSubmitting: SetState<boolean>
): Promise<boolean> => {
  setSubmitting(true);
  try {
    const response = await ratingService.createRating(data);
    
    if (response.success) {
      message.success('Gửi đánh giá thành công!');
      return true;
    } else {
      message.error(response.message || 'Không thể gửi đánh giá');
      return false;
    }
  } catch (error) {
    console.error('Error submitting rating:', error);
    message.error('Lỗi khi gửi đánh giá');
    return false;
  } finally {
    setSubmitting(false);
  }
};

// Thêm hàm kiểm tra trạng thái đánh giá
export const checkRatingStatus = async (
  appointmentId: number,
  setChecking: SetState<boolean>
): Promise<{
  canRate: boolean;
  existingRating?: any;
}> => {
  setChecking(true);
  try {
    const response = await ratingService.getRatingByAppointment(appointmentId);
    
    if (response.success) {
      return {
        canRate: !response.data,
        existingRating: response.data
      };
    } else {
      message.error('Không thể kiểm tra trạng thái đánh giá');
      return { canRate: false };
    }
  } catch (error) {
    console.error('Error checking rating status:', error);
    message.error('Lỗi khi kiểm tra trạng thái đánh giá');
    return { canRate: false };
  } finally {
    setChecking(false);
  }
};

// Thêm hàm lấy thống kê đánh giá
export const getRatingStatistics = async (
  type: 'service' | 'employee',
  id: number,
  setLoading: SetState<boolean>
): Promise<{
  averageRating: number;
  totalRatings: number;
  ratingDistribution: { [key: number]: number };
} | null> => {
  setLoading(true);
  try {
    const response = await ratingService.getRatingStatistics(type, id);
    
    if (response.success) {
      return response.data;
    } else {
      message.error('Không thể tải thống kê đánh giá');
      return null;
    }
  } catch (error) {
    console.error('Error fetching rating statistics:', error);
    message.error('Lỗi khi tải thống kê đánh giá');
    return null;
  } finally {
    setLoading(false);
  }
};

// Thêm hàm xử lý phản hồi đánh giá (cho admin)
export const respondToRating = async (
  ratingId: number,
  response: string,
  setSubmitting: SetState<boolean>
): Promise<boolean> => {
  setSubmitting(true);
  try {
    const result = await ratingService.respondToRating(ratingId, response);
    
    if (result.success) {
      message.success('Gửi phản hồi thành công!');
      return true;
    } else {
      message.error(result.message || 'Không thể gửi phản hồi');
      return false;
    }
  } catch (error) {
    console.error('Error responding to rating:', error);
    message.error('Lỗi khi gửi phản hồi');
    return false;
  } finally {
    setSubmitting(false);
  }
};

// Cập nhật hàm kiểm tra trạng thái đánh giá và lấy thông tin appointment
export const checkAppointmentForRating = async (
  appointmentId: number,
  setLoading: SetState<boolean>
): Promise<{
  canRate: boolean;
  appointmentData?: any;
  existingRating?: any;
}> => {
  setLoading(true);
  try {
    // Lấy thông tin lịch hẹn từ API
    console.log("Getting appointment:", appointmentId);
    const appointmentRes = await getAppointmentById(appointmentId);
    console.log("Appointment response:", appointmentRes);
    
    if (!appointmentRes || !appointmentRes.success) {
      console.error('Failed to get appointment:', appointmentRes);
      message.error('Không thể tải thông tin lịch hẹn');
      return { canRate: false };
    }
    
    const appointmentData = appointmentRes.data;
    console.log("Appointment data:", appointmentData);
    
    if (!appointmentData) {
      message.error('Không tìm thấy dữ liệu lịch hẹn');
      return { canRate: false };
    }
    
    // Kiểm tra xem lịch hẹn đã hoàn thành chưa
    if (appointmentData.status !== 'completed') {
      message.warning('Chỉ có thể đánh giá các lịch hẹn đã hoàn thành');
      return { canRate: false, appointmentData };
    }
    
    // Kiểm tra xem đã đánh giá chưa
    try {
      const ratingRes = await getRatingByAppointment(appointmentId);
      console.log("Rating response:", ratingRes);
      
      if (ratingRes.success && ratingRes.data) {
        // Đã có đánh giá
        return {
          canRate: false,
          appointmentData,
          existingRating: ratingRes.data
        };
      }
    } catch (ratingError) {
      console.error('Error checking rating:', ratingError);
      // Nếu lỗi kiểm tra rating, vẫn cho phép đánh giá
    }
    
    // Chưa có đánh giá và đủ điều kiện đánh giá
    return {
      canRate: true,
      appointmentData
    };
  } catch (error) {
    console.error('Error checking appointment for rating:', error);
    message.error('Lỗi khi kiểm tra trạng thái đánh giá');
    return { canRate: false };
  } finally {
    setLoading(false);
  }
};

// Chỉnh sửa hàm gửi đánh giá để phù hợp với backend
export const submitAppointmentRating = async (
  data: {
    appointment_id: number;
    rating: number;
    comment: string;
  },
  setSubmitting: SetState<boolean>
): Promise<boolean> => {
  setSubmitting(true);
  try {
    const response = await ratingService.createRating(data);
    
    if (response.success) {
      message.success('Gửi đánh giá thành công!');
      return true;
    } else {
      message.error(response.message || 'Không thể gửi đánh giá');
      return false;
    }
  } catch (error) {
    console.error('Error submitting rating:', error);
    message.error('Lỗi khi gửi đánh giá');
    return false;
  } finally {
    setSubmitting(false);
  }
}; 