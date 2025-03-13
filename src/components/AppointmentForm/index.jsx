import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import moment from 'moment';
import styles from './index.less';

const AppointmentForm = ({
  visible,
  onCancel,
  onSubmit,
  employees,
  services,
  availableSlots,
  loading,
  slotsLoading,
  onValuesChange,
  formatTime,
}) => {
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);
  
  const handleValuesChange = async (changedValues, allValues) => {
    console.log('Changed values:', changedValues);
    
    if (changedValues.employee_id || changedValues.service_id || changedValues.appointment_date) {
      const { employee_id, service_id, appointment_date } = allValues;
      
      if (employee_id && service_id && appointment_date) {
        onValuesChange({
          employee_id,
          service_id,
          appointment_date: appointment_date.format('YYYY-MM-DD')
        });
      }
    }
  };
  
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const formattedValues = {
          ...values,
          appointment_date: values.appointment_date.format('YYYY-MM-DD'),
        };
        onSubmit(formattedValues);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };
  
  const canSelectTimeSlot = () => {
    const values = form.getFieldsValue();
    return values.employee_id && values.service_id && values.appointment_date;
  };
  
  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };
  
  return (
    <Modal
      title="Đặt lịch hẹn mới"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
      >
        <Form.Item
          name="customer_name"
          label="Tên khách hàng"
          rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>
        
        <Form.Item
          name="customer_phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại' },
            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        
        <Form.Item
          name="service_id"
          label="Dịch vụ"
          rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
        >
          <Select
            placeholder="Chọn dịch vụ"
            options={services.map(service => ({
              value: service.id,
              label: `${service.name} (${service.duration} phút - ${service.price.toLocaleString()}đ)`
            }))}
          />
        </Form.Item>
        
        <Form.Item
          name="employee_id"
          label="Nhân viên"
          rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
        >
          <Select
            placeholder="Chọn nhân viên"
            options={employees.map(employee => ({
              value: employee.id,
              label: employee.name
            }))}
          />
        </Form.Item>
        
        <Form.Item
          name="appointment_date"
          label="Ngày hẹn"
          rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            disabledDate={disabledDate}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày hẹn"
          />
        </Form.Item>
        
        <Form.Item
          name="appointment_time"
          label="Giờ hẹn"
          rules={[{ required: true, message: 'Vui lòng chọn giờ hẹn' }]}
          extra={!canSelectTimeSlot() ? "Vui lòng chọn nhân viên, dịch vụ và ngày hẹn trước" : null}
        >
          <Select
            placeholder="Chọn giờ hẹn"
            loading={slotsLoading}
            disabled={!canSelectTimeSlot()}
          >
            {availableSlots.map(slot => (
              <Select.Option key={slot.start_time} value={slot.start_time}>
                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item className={styles.formButtons}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Đặt lịch
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppointmentForm; 