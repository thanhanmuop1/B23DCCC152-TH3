import { message } from 'antd';
import moment from 'moment';
import * as statisticsService from '@/services/management/statistics';
import { 
  DashboardStats, 
  AppointmentDailyStats, 
  AppointmentMonthlyStats,
  ServiceRevenueStats,
  EmployeeRevenueStats
} from '@/services/management/statistics';

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export const getDefaultDateRange = () => {
  const endDate = moment().format('YYYY-MM-DD');
  const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  return { startDate, endDate };
};

export const fetchDashboardStats = async (
  setDashboardStats: SetState<DashboardStats>
): Promise<DashboardStats | null> => {
  try {
    const response = await statisticsService.getDashboardStats();
    if (response.success) {
      setDashboardStats(response.data);
      return response.data;
    } else {
      message.error('Không thể tải thống kê tổng quan');
      return null;
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    message.error('Lỗi khi tải thống kê tổng quan');
    return null;
  }
};

export const fetchAppointmentStats = async (
  startDate: string,
  endDate: string,
  setAppointmentStats: SetState<AppointmentDailyStats[]>,
  setLoading: SetState<boolean>
): Promise<AppointmentDailyStats[] | null> => {
  setLoading(true);
  try {
    const response = await statisticsService.getAppointmentsByDay({
      start_date: startDate,
      end_date: endDate,
    });

    if (response.success) {
      setAppointmentStats(response.data);
      return response.data;
    } else {
      message.error('Không thể tải thống kê lịch hẹn theo ngày');
      return null;
    }
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    message.error('Lỗi khi tải thống kê lịch hẹn theo ngày');
    return null;
  } finally {
    setLoading(false);
  }
};

export const fetchMonthlyStats = async (
  year: number,
  setMonthlyStats: SetState<AppointmentMonthlyStats[]>,
  setLoading: SetState<boolean>
): Promise<AppointmentMonthlyStats[] | null> => {
  setLoading(true);
  try {
    const response = await statisticsService.getAppointmentsByMonth({ year });

    if (response.success) {
      setMonthlyStats(response.data);
      return response.data;
    } else {
      message.error('Không thể tải thống kê lịch hẹn theo tháng');
      return null;
    }
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    message.error('Lỗi khi tải thống kê lịch hẹn theo tháng');
    return null;
  } finally {
    setLoading(false);
  }
};

export const fetchRevenueStats = async (
  startDate: string,
  endDate: string,
  setServiceRevenue: SetState<ServiceRevenueStats[]>,
  setEmployeeRevenue: SetState<EmployeeRevenueStats[]>,
  setLoading: SetState<boolean>
): Promise<{
  serviceRevenue: ServiceRevenueStats[] | null;
  employeeRevenue: EmployeeRevenueStats[] | null;
}> => {
  setLoading(true);
  try {
    const [serviceResponse, employeeResponse] = await Promise.all([
      statisticsService.getRevenueByService({ start_date: startDate, end_date: endDate }),
      statisticsService.getRevenueByEmployee({ start_date: startDate, end_date: endDate }),
    ]);

    if (serviceResponse.success && employeeResponse.success) {
      setServiceRevenue(serviceResponse.data);
      setEmployeeRevenue(employeeResponse.data);
      return {
        serviceRevenue: serviceResponse.data,
        employeeRevenue: employeeResponse.data,
      };
    } else {
      message.error('Không thể tải thống kê doanh thu');
      return {
        serviceRevenue: null,
        employeeRevenue: null,
      };
    }
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    message.error('Lỗi khi tải thống kê doanh thu');
    return {
      serviceRevenue: null,
      employeeRevenue: null,
    };
  } finally {
    setLoading(false);
  }
}; 