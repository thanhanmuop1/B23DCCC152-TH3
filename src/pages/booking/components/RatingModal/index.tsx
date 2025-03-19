import React, { useEffect, useState } from 'react';
import { Modal, Form, Rate, Input, Button, Spin, Result } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { checkAppointmentForRating, submitAppointmentRating } from '@/models/management/ratings';
import styles from './style.less';

const { TextArea } = Input;

interface RatingModalProps {
  visible: boolean;
  appointmentId: number | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  appointmentId,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [canRate, setCanRate] = useState(false);
  const [existingRating, setExistingRating] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && appointmentId) {
      form.resetFields();
      checkAppointmentStatus();
    }
  }, [visible, appointmentId]);

  const checkAppointmentStatus = async () => {
    if (!appointmentId) return;

    try {
      console.log("Checking appointment:", appointmentId);
      const result = await checkAppointmentForRating(appointmentId, setLoading);
      console.log("Check result:", result);
      
      setCanRate(result.canRate);
      
      if (result.appointmentData) {
        setAppointmentData(result.appointmentData);
      } else {
        setError('Không thể tải thông tin lịch hẹn');
      }
      
      if (result.existingRating) {
        setExistingRating(result.existingRating);
      }
    } catch (err) {
      console.error("Error checking appointment status:", err);
      setError('Đã xảy ra lỗi khi kiểm tra lịch hẹn');
    }
  };

  const handleSubmit = async (values: any) => {
    if (!appointmentId) return;
    
    try {
      const success = await submitAppointmentRating(
        {
          appointment_id: appointmentId,
          rating: values.rating,
          comment: values.comment,
        },
        setSubmitting
      );
      
      if (success) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <Spin tip="Đang tải..." />
        </div>
      );
    }

    if (error) {
      return (
        <Result
          status="error"
          title={error}
          subTitle="Vui lòng thử lại sau"
        />
      );
    }

    if (!appointmentData) {
      return (
        <Result
          status="warning"
          title="Không thể tải thông tin lịch hẹn"
          subTitle="Vui lòng thử lại sau"
        />
      );
    }

    if (existingRating) {
      return (
        <Result
          status="info"
          title="Lịch hẹn này đã được đánh giá"
          subTitle={
            <div className={styles.existingRating}>
              <div>Đánh giá: <Rate disabled value={existingRating.rating} /></div>
              <div>Nhận xét: {existingRating.comment}</div>
            </div>
          }
        />
      );
    }

    if (!canRate) {
      return (
        <Result
          status="warning"
          title="Không thể đánh giá"
          subTitle="Chỉ có thể đánh giá các lịch hẹn đã hoàn thành"
        />
      );
    }

    return (
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className={styles.appointmentInfo}>
          <h3>Thông tin lịch hẹn</h3>
          <p><strong>Khách hàng:</strong> {appointmentData.customer_name || 'N/A'}</p>
          <p><strong>Dịch vụ:</strong> {appointmentData.service_name || 'N/A'}</p>
          <p><strong>Nhân viên:</strong> {appointmentData.employee_name || 'N/A'}</p>
          <p><strong>Thời gian:</strong> {appointmentData.appointment_date || 'N/A'} {appointmentData.appointment_time || ''}</p>
        </div>

        <Form.Item
          name="rating"
          label="Đánh giá của bạn"
          rules={[{ required: true, message: 'Vui lòng đánh giá' }]}
        >
          <Rate character={<StarFilled />} className={styles.rating} />
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
            placeholder="Chia sẻ trải nghiệm của bạn..."
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title="Đánh giá dịch vụ"
      visible={visible}
      onCancel={onCancel}
      width={600}
      footer={
        canRate ? [
          <Button key="cancel" onClick={onCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            onClick={() => form.submit()}
          >
            Gửi đánh giá
          </Button>,
        ] : [
          <Button key="close" type="primary" onClick={onCancel}>
            Đóng
          </Button>,
        ]
      }
    >
      {renderContent()}
    </Modal>
  );
};

export default RatingModal; 