import React from 'react';
import { Card, Tag, Typography, Space, Button, Dropdown, Menu } from 'antd';
import { EllipsisOutlined, CheckOutlined, CloseOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { AppointmentData } from '../model';
import { useDispatch } from 'umi';

const { Text } = Typography;

interface AppointmentCardProps {
  appointment: AppointmentData;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const dispatch = useDispatch();
  
  const handleStatusChange = (status: string) => {
    dispatch({
      type: 'booking/updateStatus',
      payload: {
        id: appointment.id,
        status,
      },
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'processing';
      case 'canceled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleOutlined />;
      case 'pending':
        return <ClockCircleOutlined />;
      case 'completed':
        return <CheckOutlined />;
      case 'canceled':
        return <CloseOutlined />;
      default:
        return null;
    }
  };
  
  const menu = (
    <Menu>
      <Menu.Item key="confirm" onClick={() => handleStatusChange('confirmed')}>
        <CheckOutlined /> Confirm
      </Menu.Item>
      <Menu.Item key="complete" onClick={() => handleStatusChange('completed')}>
        <CheckCircleOutlined /> Complete
      </Menu.Item>
      <Menu.Item key="cancel" onClick={() => handleStatusChange('canceled')}>
        <CloseOutlined /> Cancel
      </Menu.Item>
    </Menu>
  );

  return (
    <Card 
      size="small" 
      style={{ 
        marginBottom: 8,
        borderLeft: `4px solid ${
          appointment.status === 'confirmed' ? '#52c41a' : 
          appointment.status === 'pending' ? '#faad14' : 
          appointment.status === 'completed' ? '#1890ff' : '#f5222d'
        }`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Text strong>{appointment.service_name}</Text>
          <div>
            <Text type="secondary">
              {moment(appointment.appointment_time, 'HH:mm:ss').format('HH:mm')} - {moment(appointment.end_time, 'HH:mm:ss').format('HH:mm')}
            </Text>
          </div>
          <div>
            <Text>Customer: {appointment.customer_name} ({appointment.customer_phone})</Text>
          </div>
          <div>
            <Text>Employee: {appointment.employee_name}</Text>
          </div>
        </div>
        <div>
          <Space direction="vertical" align="end">
            <Tag color={getStatusColor(appointment.status)} icon={getStatusIcon(appointment.status)}>
              {appointment.status}
            </Tag>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button type="text" icon={<EllipsisOutlined />} />
            </Dropdown>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default AppointmentCard; 