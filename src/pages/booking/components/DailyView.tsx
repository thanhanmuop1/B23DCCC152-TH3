import React from 'react';
import { Card, Row, Col, Typography, DatePicker, Select, Button, Spin, Empty, Space } from 'antd';
import { LeftOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { AppointmentData } from '../model';
import AppointmentCard from './AppointmentCard';
import { useRequest, useDispatch } from 'umi';
import { getAllEmployees } from '@/services/management/employee';
import { getAllServices } from '@/services/management/service';

const { Title, Text } = Typography;
const { Option } = Select;

interface DailyViewProps {
  appointments: AppointmentData[];
  loading: boolean;
  selectedDate: string;
  onDateChange: (date: moment.Moment | null) => void;
  onFilterChange: (type: string, value: number | undefined) => void;
  filters: {
    employee_id?: number;
    service_id?: number;
    status?: string;
  };
  onAddAppointment?: () => void;
}

const DailyView: React.FC<DailyViewProps> = ({ 
  appointments, 
  loading, 
  selectedDate,
  onDateChange,
  onFilterChange,
  filters,
  onAddAppointment
}) => {
  // Sử dụng useRequest để lấy danh sách nhân viên và dịch vụ
  const { data: employeesData, loading: employeesLoading } = useRequest(getAllEmployees);
  const { data: servicesData, loading: servicesLoading } = useRequest(getAllServices);
  
  const employees = employeesData|| [];
  const services = servicesData || [];
  
  // Tạo các khung giờ từ 8:00 đến 20:00
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);
  
  const dispatch = useDispatch();

  const handlePrevDay = () => {
    const prevDay = moment(selectedDate).subtract(1, 'day');
    onDateChange(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = moment(selectedDate).add(1, 'day');
    onDateChange(nextDay);
  };

  const getAppointmentsForTimeSlot = (hour: number) => {
    return appointments.filter(app => {
      const appHour = moment(app.appointment_time, 'HH:mm:ss').hour();
      return appHour === hour;
    });
  };

  const formatTimeSlot = (hour: number) => {
    return `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`;
  };

  const handleStatusUpdate = (id: number, status: string) => {
    dispatch({
      type: 'booking/updateAppointmentStatus',
      payload: { id, status },
    });
  };

  return (
    <Card>
      <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Button icon={<LeftOutlined />} onClick={handlePrevDay} />
        </Col>
        <Col>
          <DatePicker 
            value={moment(selectedDate)} 
            onChange={onDateChange}
            allowClear={false}
            format="dddd, MMMM D, YYYY"
          />
        </Col>
        <Col>
          <Button icon={<RightOutlined />} onClick={handleNextDay} />
        </Col>
        <Col flex="auto" />
        <Col>
          <Space>
            <Select
              placeholder="All Employees"
              style={{ width: 150 }}
              allowClear
              value={filters.employee_id}
              onChange={(value) => onFilterChange('employee_id', value)}
              loading={employeesLoading}
            >
              {employees.map(emp => (
                <Option key={emp.id} value={emp.id}>{emp.name}</Option>
              ))}
            </Select>
            
            <Select
              placeholder="All Services"
              style={{ width: 150 }}
              allowClear
              value={filters.service_id}
              onChange={(value) => onFilterChange('service_id', value)}
              loading={servicesLoading}
            >
              {services.map(service => (
                <Option key={service.id} value={service.id}>{service.name}</Option>
              ))}
            </Select>
            
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={onAddAppointment}
            >
              Add
            </Button>
          </Space>
        </Col>
      </Row>

      <Spin spinning={loading}>
        <div className="daily-schedule">
          <Title level={4}>Appointments</Title>
          <Text type="secondary">Daily schedule</Text>
          
          {timeSlots.map(hour => {
            const slotAppointments = getAppointmentsForTimeSlot(hour);
            
            return (
              <Row key={hour} className="time-slot" style={{ marginTop: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                <Col span={4}>
                  <Text strong>{formatTimeSlot(hour)}</Text>
                </Col>
                <Col span={20}>
                  {slotAppointments.length > 0 ? (
                    slotAppointments.map(appointment => (
                      <AppointmentCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))
                  ) : (
                    <Text type="secondary">No appointments</Text>
                  )}
                </Col>
              </Row>
            );
          })}
          
          {appointments.length === 0 && !loading && (
            <Empty description="No appointments for this day" />
          )}
        </div>
      </Spin>
    </Card>
  );
};

export default DailyView; 