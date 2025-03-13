import React from 'react';
import { Result, Button, Card } from 'antd';
import { useDispatch } from 'umi';
import { CheckCircleOutlined, StarOutlined } from '@ant-design/icons';
import styles from './style.less';

interface BookingResultProps {
  bookingResult: any;
}

const BookingResult: React.FC<BookingResultProps> = ({ bookingResult }) => {
  const dispatch = useDispatch();

  const handleReview = () => {
    dispatch({ type: 'userBooking/setCurrentStep', payload: 2 });
  };

  return (
    <div className={styles.resultContainer}>
      <Card className={styles.resultCard}>
        <Result
          icon={<CheckCircleOutlined className={styles.successIcon} />}
          status="success"
          title="Đặt lịch thành công!"
          subTitle={
            <div className={styles.bookingDetails}>
              <p>Mã đặt lịch: {bookingResult?.id}</p>
              <p>Dịch vụ: {bookingResult?.service_name}</p>
              <p>Nhân viên: {bookingResult?.employee_name}</p>
              <p>Ngày: {bookingResult?.appointment_date}</p>
              <p>Giờ: {bookingResult?.appointment_time}</p>
            </div>
          }
          extra={[
            <Button
              key="review"
              type="primary"
              icon={<StarOutlined />}
              size="large"
              onClick={handleReview}
            >
              Đánh giá dịch vụ
            </Button>
          ]}
        />
      </Card>
    </div>
  );
};

export default BookingResult; 