import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Spin, message, Card } from 'antd';
import { useDispatch } from 'umi';
import moment from 'moment';
import { useRequest } from 'umi';
import { getAllServices, getServiceEmployees } from '@/services/management/service';
import type { AvailableSlot } from '@/pages/booking/model';
import styles from './style.less';

const { Option } = Select;

const BookingForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [serviceEmployees, setServiceEmployees] = useState<any[]>([]);

  // Lấy danh sách dịch vụ
  const { data: servicesData, loading: servicesLoading } = useRequest(getAllServices);
  const services = servicesData || [];

  // Xử lý khi chọn dịch vụ
  const handleServiceChange = async (serviceId: number) => {
    if (serviceId) {
      setLoading(true);
      try {
        const response = await getServiceEmployees(serviceId);
        if (response.success) {
          setServiceEmployees(response.data || []);
          form.setFieldsValue({ employee_id: undefined });
        } else {
          message.error('Không thể lấy danh sách nhân viên');
        }
      } catch (error) {
        message.error('Lỗi khi lấy danh sách nhân viên');
      }
      setLoading(false);
    } else {
      setServiceEmployees([]);
    }
    setAvailableSlots([]);
  };

  // Xử lý khi chọn nhân viên
  const handleEmployeeChange = () => {
    const service_id = form.getFieldValue('service_id');
    const employee_id = form.getFieldValue('employee_id');
    const date = form.getFieldValue('appointment_date');
    
    if (service_id && employee_id && date) {
      setLoading(true);
      dispatch({
        type: 'booking/fetchAvailableSlots',
        payload: {
          service_id,
          employee_id,
          date: date.format('YYYY-MM-DD'),
        },
      }).then((response: any) => {
        if (response && response.success) {
          setAvailableSlots(response.data);
        } else {
          message.error('Không thể lấy thời gian trống');
        }
        setLoading(false);
      });
    }
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const { appointment_date, appointment_time, ...rest } = values;
      const formattedDate = appointment_date.format('YYYY-MM-DD');
      
      dispatch({
        type: 'userBooking/submitBooking',
        payload: {
          ...rest,
          appointment_date: formattedDate,
          appointment_time: appointment_time,
        },
      });
    });
  };

  return (
    <div className={styles.formContainer}>
      <Card className={styles.formCard}>
        <h2>Đặt Lịch Hẹn</h2>
        <Spin spinning={loading || servicesLoading}>
          <Form
            form={form}
            layout="vertical"
            className={styles.form}
          >
            <Form.Item
              name="customer_name"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input placeholder="Nhập họ và tên của bạn" />
            </Form.Item>
            
            <Form.Item
              name="customer_phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input placeholder="Nhập số điện thoại của bạn" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { type: 'email', message: 'Email không hợp lệ' },
                { required: true, message: 'Vui lòng nhập email' }
              ]}
            >
              <Input placeholder="Nhập email của bạn" />
            </Form.Item>
            
            <Form.Item
              name="service_id"
              label="Dịch vụ"
              rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
            >
              <Select 
                placeholder="Chọn dịch vụ"
                onChange={handleServiceChange}
              >
                {services.map(service => (
                  <Option key={service.id} value={service.id}>
                    {service.name} - {service.duration} phút - {service.price.toLocaleString()}đ
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="employee_id"
              label="Nhân viên"
              rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
            >
              <Select 
                placeholder="Chọn nhân viên"
                onChange={handleEmployeeChange}
                disabled={!form.getFieldValue('service_id')}
              >
                {serviceEmployees.map(employee => (
                  <Option key={employee.id} value={employee.id}>
                    {employee.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="appointment_date"
              label="Ngày hẹn"
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                onChange={handleEmployeeChange}
                disabledDate={(current) => {
                  return current && current < moment().startOf('day');
                }}
                placeholder="Chọn ngày hẹn"
              />
            </Form.Item>
            
            <Form.Item
              name="appointment_time"
              label="Giờ hẹn"
              rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
            >
              <Select 
                placeholder="Chọn giờ hẹn"
                disabled={!form.getFieldValue('appointment_date')}
              >
                {availableSlots.map(slot => (
                  <Option key={slot.start_time} value={slot.start_time}>
                    {moment(slot.start_time, 'HH:mm:ss').format('HH:mm')} - {moment(slot.end_time, 'HH:mm:ss').format('HH:mm')}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item className={styles.submitButton}>
              <Button type="primary" size="large" onClick={handleSubmit}>
                Đặt lịch
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default BookingForm; 