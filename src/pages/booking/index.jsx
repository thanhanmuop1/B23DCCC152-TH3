import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Button, 
  Select, 
  DatePicker, 
  Row, 
  Col, 
  Table, 
  Tag, 
  Space, 
  message, 
  Form 
} from 'antd';
import { 
  CalendarOutlined, 
  UnorderedListOutlined, 
  SettingOutlined, 
  PlusOutlined 
} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/vi';
import * as appointmentManager from '@/models/management/appointment';
import * as employeeManager from '@/models/management/employee';
import * as serviceManager from '@/models/management/service';
import AppointmentCalendar from '@/components/AppointmentCalendar';
import AppointmentListView from '@/components/AppointmentListView';
import AppointmentForm from '@/components/AppointmentForm';
import styles from './index.less';

moment.locale('vi');
const { TabPane } = Tabs;

const BookingPage = () => {
  // State cho dữ liệu và UI
  const [appointments, setAppointments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(moment());
  const [activeView, setActiveView] = useState('calendar');
  const [calendarView, setCalendarView] = useState('day');
  const [modalVisible, setModalVisible] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  
  // Form và filter
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    employeeId: null,
    serviceId: null,
    date: moment().format('YYYY-MM-DD'),
  });
  
  // Lấy dữ liệu khi component mount và khi filters thay đổi
  useEffect(() => {
    appointmentManager.fetchAppointments(filters, setAppointments, setLoading);
    employeeManager.fetchEmployeesFromAPI(setEmployees);
    serviceManager.fetchServicesFromAPI(setServices);
  }, []);
  
  useEffect(() => {
    appointmentManager.fetchAppointments(filters, setAppointments, setLoading);
  }, [filters]);
  
  // Xử lý thay đổi ngày
  const handleDateChange = (date) => {
    setCurrentDate(date);
    setFilters({
      ...filters,
      date: date.format('YYYY-MM-DD'),
    });
  };
  
  // Xử lý thay đổi filter
  const handleFilterChange = (type, value) => {
    setFilters({
      ...filters,
      [type]: value,
    });
  };
  
  // Xử lý form đặt lịch
  const handleFormValuesChange = async (values) => {
    console.log('Form values changed:', values); // Để debug
    
    const { employee_id, service_id, appointment_date } = values;
    
    if (employee_id && service_id && appointment_date) {
      try {
        setSlotsLoading(true);
        const response = await appointmentManager.fetchAvailableSlots(
          employee_id,
          appointment_date,
          service_id,
          setAvailableSlots,
          setSlotsLoading
        );
        console.log('Available slots:', response); // Để debug
      } catch (error) {
        console.error('Error fetching slots:', error);
        message.error('Không thể lấy danh sách giờ trống');
      } finally {
        setSlotsLoading(false);
      }
    }
  };
  
  // Hàm tạo lịch hẹn mới
  const handleCreateAppointment = async (values) => {
    const fetchAppointmentsCallback = () => {
      appointmentManager.fetchAppointments(filters, setAppointments, setLoading);
    };
    
    await appointmentManager.createNewAppointment(
      values, 
      setLoading, 
      setModalVisible, 
      fetchAppointmentsCallback
    );
  };
  
  // Hàm cập nhật trạng thái lịch hẹn
  const handleUpdateStatus = async (id, status) => {
    const fetchAppointmentsCallback = () => {
      appointmentManager.fetchAppointments(filters, setAppointments, setLoading);
    };
    
    await appointmentManager.updateStatus(
      id, 
      status, 
      setLoading, 
      fetchAppointmentsCallback
    );
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Booking System</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setModalVisible(true)}
        >
          New Appointment
        </Button>
      </div>
      
      <div className={styles.viewToggle}>
        <Tabs 
          activeKey={activeView} 
          onChange={setActiveView}
          tabBarExtraContent={
            <Button icon={<SettingOutlined />}>Settings</Button>
          }
        >
          <TabPane 
            tab={<span><CalendarOutlined /> Calendar View</span>} 
            key="calendar"
          />
          <TabPane 
            tab={<span><UnorderedListOutlined /> List View</span>} 
            key="list"
          />
        </Tabs>
      </div>
      
      {activeView === 'calendar' && (
        <>
          <div className={styles.filters}>
            <Row gutter={16}>
              <Col>
                <Select
                  placeholder="All Employees"
                  style={{ width: 200 }}
                  allowClear
                  onChange={(value) => handleFilterChange('employeeId', value)}
                  options={employeeManager.getEmployeeOptions(employees)}
                />
              </Col>
              <Col>
                <Select
                  placeholder="All Services"
                  style={{ width: 200 }}
                  allowClear
                  onChange={(value) => handleFilterChange('serviceId', value)}
                  options={serviceManager.getServiceOptions(services)}
                />
              </Col>
            </Row>
          </div>
          
          <AppointmentCalendar 
            appointments={appointments}
            currentDate={currentDate}
            onDateChange={handleDateChange}
            calendarView={calendarView}
            onViewChange={setCalendarView}
            loading={loading}
            onAddNew={() => setModalVisible(true)}
            onUpdateStatus={handleUpdateStatus}
            formatTime={appointmentManager.formatTime}
            getStatusColor={appointmentManager.getStatusColor}
            getStatusText={appointmentManager.getStatusText}
            getAppointmentsForHour={appointmentManager.getAppointmentsForHour}
            generateTimeSlots={appointmentManager.generateTimeSlots}
          />
        </>
      )}
      
      {activeView === 'list' && (
        <AppointmentListView
          appointments={appointments}
          loading={loading}
          currentDate={currentDate}
          onDateChange={handleDateChange}
          onFilterChange={handleFilterChange}
          handleUpdateStatus={handleUpdateStatus}
          formatTime={appointmentManager.formatTime}
          getStatusTag={appointmentManager.getStatusTag}
          getStatusText={appointmentManager.getStatusText}
          employeeOptions={employeeManager.getEmployeeOptions(employees)}
          serviceOptions={serviceManager.getServiceOptions(services)}
        />
      )}
      
      {/* Sử dụng component AppointmentForm */}
      <AppointmentForm
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setAvailableSlots([]); // Reset available slots khi đóng form
        }}
        onSubmit={handleCreateAppointment}
        employees={employees}
        services={services}
        availableSlots={availableSlots}
        loading={loading}
        slotsLoading={slotsLoading}
        onValuesChange={handleFormValuesChange}
        formatTime={appointmentManager.formatTime}
      />
    </div>
  );
};

export default BookingPage; 