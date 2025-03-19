import React, { useState } from 'react';
import { Card, Button, Tag, Dropdown, Menu, message, Modal } from 'antd';
import { EllipsisOutlined, ClockCircleOutlined, UserOutlined, CheckOutlined, CloseOutlined, StarOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch } from 'umi';
import RatingModal from './RatingModal';
import styles from './AppointmentCard.less';

interface AppointmentCardProps {
  appointment: any;
  onStatusUpdate: (id: number, status: string) => void;
}

const statusColors = {
  pending: 'orange',
  confirmed: 'blue',
  completed: 'green',
  canceled: 'red',
};

const statusLabels = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  completed: 'Đã hoàn thành',
  canceled: 'Đã hủy',
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onStatusUpdate }) => {
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const dispatch = useDispatch();

  const handleComplete = () => {
    Modal.confirm({
      title: 'Xác nhận hoàn thành',
      content: 'Bạn có chắc chắn muốn đánh dấu lịch hẹn này là đã hoàn thành?',
      onOk: () => {
        onStatusUpdate(appointment.id, 'completed');
        // Hiển thị modal đánh giá sau khi hoàn thành
        setRatingModalVisible(true);
      },
    });
  };

  const handleRatingSuccess = () => {
    setRatingModalVisible(false);
    message.success('Đánh giá đã được gửi thành công');
    // Refresh danh sách lịch hẹn
    dispatch({
      type: 'booking/fetchAppointments',
    });
  };

  const actionMenu = (
    <Menu>
      {appointment.status === 'pending' && (
        <Menu.Item key="confirm" onClick={() => onStatusUpdate(appointment.id, 'confirmed')}>
          <CheckOutlined /> Xác nhận
        </Menu.Item>
      )}
      {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
        <Menu.Item key="complete" onClick={handleComplete}>
          <CheckOutlined /> Hoàn thành
        </Menu.Item>
      )}
      {appointment.status === 'completed' && (
        <Menu.Item key="rate" onClick={() => setRatingModalVisible(true)}>
          <StarOutlined /> Đánh giá
        </Menu.Item>
      )}
      {appointment.status !== 'canceled' && appointment.status !== 'completed' && (
        <Menu.Item key="cancel" danger onClick={() => onStatusUpdate(appointment.id, 'canceled')}>
          <CloseOutlined /> Hủy
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <>
      <Card className={styles.card} size="small">
        <div className={styles.header}>
          <div className={styles.time}>
            <ClockCircleOutlined /> {moment(appointment.appointment_time, 'HH:mm:ss').format('HH:mm')}
            {' - '}
            {moment(appointment.end_time, 'HH:mm:ss').format('HH:mm')}
          </div>
          <Tag color={statusColors[appointment.status]}>{statusLabels[appointment.status]}</Tag>
        </div>
        
        <div className={styles.title}>{appointment.service_name}</div>
        
        <div className={styles.content}>
          <div className={styles.customerInfo}>
            <div><UserOutlined /> {appointment.customer_name}</div>
            <div>{appointment.customer_phone}</div>
          </div>
          
          <div className={styles.actions}>
            {appointment.status === 'pending' && (
              <Button
                size="small"
                type="primary"
                onClick={() => onStatusUpdate(appointment.id, 'confirmed')}
              >
                Xác nhận
              </Button>
            )}
            
            {appointment.status === 'confirmed' && (
              <Button
                size="small"
                type="primary"
                onClick={handleComplete}
              >
                Hoàn thành
              </Button>
            )}
            
            {appointment.status === 'completed' && (
              <Button
                size="small"
                type="primary"
                icon={<StarOutlined />}
                onClick={() => setRatingModalVisible(true)}
              >
                Đánh giá
              </Button>
            )}
            
            <Dropdown overlay={actionMenu} trigger={['click']}>
              <Button size="small" icon={<EllipsisOutlined />} />
            </Dropdown>
          </div>
        </div>
      </Card>

      <RatingModal
        visible={ratingModalVisible}
        appointmentId={appointment.id}
        onCancel={() => setRatingModalVisible(false)}
        onSuccess={handleRatingSuccess}
      />
    </>
  );
};

export default AppointmentCard; 