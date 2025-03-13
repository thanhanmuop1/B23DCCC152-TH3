import React from 'react';
import { Card, Steps } from 'antd';
import { connect, Dispatch } from 'umi';
import BookingForm from './components/BookingForm';
import BookingResult from './components/BookingResult';
import ReviewForm from './components/ReviewForm';
import { UserBookingModelState } from './model';
import styles from './style.less';

const { Step } = Steps;

interface UserBookingPageProps {
  dispatch: Dispatch;
  userBooking: UserBookingModelState;
}

const UserBookingPage: React.FC<UserBookingPageProps> = ({ userBooking, dispatch }) => {
  const { currentStep, bookingResult } = userBooking;

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return <BookingForm />;
      case 1:
        return <BookingResult bookingResult={bookingResult} />;
      case 2:
        return <ReviewForm />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Steps current={currentStep} className={styles.steps}>
          <Step title="Đặt lịch" />
          <Step title="Xác nhận" />
          <Step title="Đánh giá" />
        </Steps>
        {renderContent()}
      </Card>
    </div>
  );
};

export default connect(({ userBooking }: { userBooking: UserBookingModelState }) => ({
  userBooking,
}))(UserBookingPage); 