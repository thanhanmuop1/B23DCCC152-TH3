import React, { useEffect } from 'react';
import { Form, Input, Rate, Button, Card, Result } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { StarFilled } from '@ant-design/icons';
import { createRating } from '@/services/management/ratings';
import styles from './style.less';

const { TextArea } = Input;

const ReviewForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { bookingResult, review, loading } = useSelector((state: any) => state.userBooking);

  useEffect(() => {
    if (bookingResult?.id) {
      dispatch({
        type: 'userBooking/checkReviewStatus',
        payload: bookingResult.id,
      });
    }
  }, [bookingResult]);

  const handleSubmit = (values: any) => {
    createRating({
      appointment_id: bookingResult.id,
      rating: values.rating,
      comment: values.comment,
    });
  };

  if (!review.canReview) {
    return (
      <Result
        status="info"
        title="Bạn đã đánh giá dịch vụ này"
        subTitle="Cảm ơn bạn đã để lại đánh giá!"
      />
    );
  }

  return (
    <div className={styles.reviewContainer}>
      <Card className={styles.reviewCard}>
        <h2>Đánh giá dịch vụ</h2>
        <div className={styles.bookingInfo}>
          <p>Dịch vụ: {bookingResult?.service_name}</p>
          <p>Nhân viên: {bookingResult?.employee_name}</p>
          <p>Thời gian: {bookingResult?.appointment_time}</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Form.Item
            name="rating"
            label="Đánh giá của bạn"
            rules={[{ required: true, message: 'Vui lòng đánh giá' }]}
          >
            <Rate
              character={<StarFilled />}
              className={styles.rateStars}
            />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Nhận xét"
            rules={[
              { required: true, message: 'Vui lòng nhập nhận xét' },
              { min: 10, message: 'Nhận xét ít nhất 10 ký tự' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item className={styles.submitButton}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              loading={loading}
            >
              Gửi đánh giá
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ReviewForm; 