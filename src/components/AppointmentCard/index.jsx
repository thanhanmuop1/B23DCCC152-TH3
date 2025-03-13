import React from 'react';
import { Card, Tag, Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './index.less';

const AppointmentCard = ({ 
  appointment, 
  onUpdateStatus, 
  formatTime, 
  getStatusColor, 
  getStatusText 
}) => {
  return (
    <Card 
      className={styles.appointmentCard}
      style={{ borderLeft: `4px solid ${getStatusColor(appointment.status)}` }}
    >
      <div className={styles.appointmentHeader}>
        <h3>{appointment.service_name}</h3>
        <Tag color={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Tag>
      </div>
      <div className={styles.appointmentTime}>
        {formatTime(appointment.appointment_time)} - {formatTime(appointment.end_time)}
      </div>
      <div className={styles.appointmentDetails}>
        <div>
          <strong>Khách hàng:</strong> {appointment.customer_name}
        </div>
        <div>
          <strong>SĐT:</strong> {appointment.customer_phone}
        </div>
        <div>
          <strong>Nhân viên:</strong> {appointment.employee_name}
        </div>
        <div>
          <strong>Giá:</strong> {Number(appointment.service_price).toLocaleString()}đ
        </div>
      </div>
      {appointment.status === 'pending' && (
        <div className={styles.appointmentActions}>
          <Button 
            type="primary" 
            size="small" 
            icon={<CheckOutlined />} 
            onClick={() => onUpdateStatus(appointment.id, 'confirmed')}
          >
            Xác nhận
          </Button>
          <Button 
            danger 
            size="small" 
            icon={<CloseOutlined />} 
            onClick={() => onUpdateStatus(appointment.id, 'canceled')}
          >
            Hủy
          </Button>
        </div>
      )}
      {appointment.status === 'confirmed' && (
        <div className={styles.appointmentActions}>
          <Button 
            type="primary" 
            size="small" 
            onClick={() => onUpdateStatus(appointment.id, 'completed')}
          >
            Hoàn thành
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AppointmentCard; 