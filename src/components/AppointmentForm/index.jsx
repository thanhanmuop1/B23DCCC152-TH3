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
  }, [visible, form]);
  
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        appointment_date: values.appointment_date.format('YYYY-MM-DD'),
      };
      
      onSubmit(formattedValues);
    });
  };
  
  return (
    <Modal
      title="New Appointment"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          name="customer_name"
          label="Customer Name"
          rules={[{ required: true, message: 'Please enter customer name' }]}
        >
          <Input placeholder="Enter customer name" />
        </Form.Item>
        
        <Form.Item
          name="customer_phone"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>
        
        <Form.Item
          name="service_id"
          label="Service"
          rules={[{ required: true, message: 'Please select a service' }]}
        >
          <Select 
            placeholder="Select service"
            options={services.map(service => ({
              value: service.id,
              label: `${service.name} (${service.duration} min - ${service.price.toLocaleString()}đ)`
            }))}
          />
        </Form.Item>
        
        <Form.Item
          name="employee_id"
          label="Employee"
          rules={[{ required: true, message: 'Please select an employee' }]}
        >
          <Select 
            placeholder="Select employee"
            options={employees.map(employee => ({
              value: employee.id,
              label: employee.name
            }))}
          />
        </Form.Item>
        
        <Form.Item
          name="appointment_date"
          label="Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            disabledDate={(current) => current && current < moment().startOf('day')}
          />
        </Form.Item>
        
        <Form.Item
          name="appointment_time"
          label="Time"
          rules={[{ required: true, message: 'Please select a time' }]}
        >
          <Select
            placeholder="Select time"
            loading={slotsLoading}
            disabled={!form.getFieldValue('employee_id') || !form.getFieldValue('service_id') || !form.getFieldValue('appointment_date')}
          >
            {availableSlots.map(slot => (
              <Select.Option key={slot.start_time} value={slot.start_time}>
                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item>
          <div className={styles.formButtons}>
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Book Appointment
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppointmentForm; 