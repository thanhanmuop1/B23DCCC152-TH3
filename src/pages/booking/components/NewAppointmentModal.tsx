import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, DatePicker, Input, Button, Spin, message } from 'antd';
import { useDispatch } from 'umi';
import moment from 'moment';
import { useRequest } from 'umi';
import { getAllServices, getServiceEmployees } from '@/services/management/service';
import type { AvailableSlot } from '../model';

const { Option } = Select;

interface NewAppointmentModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  selectedDate: string;
}

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  selectedDate,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [serviceEmployees, setServiceEmployees] = useState<any[]>([]);

  // Lấy danh sách dịch vụ
  const { data: servicesData, loading: servicesLoading } = useRequest(getAllServices);
  const services = servicesData || [];

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({
        appointment_date: moment(selectedDate),
      });
    }
  }, [visible, selectedDate]);

  // Xử lý khi chọn dịch vụ
  const handleServiceChange = async (serviceId: number) => {
    if (serviceId) {
      setLoading(true);
      try {
        // Lấy danh sách nhân viên theo dịch vụ
        const response = await getServiceEmployees(serviceId);
        if (response.success) {
          setServiceEmployees(response.data || []);
          // Reset employee selection
          form.setFieldsValue({ employee_id: undefined });
        } else {
          message.error('Failed to fetch employees for this service');
        }
      } catch (error) {
        message.error('Error fetching service employees');
      }
      setLoading(false);
    } else {
      setServiceEmployees([]);
    }
    // Reset available slots when service changes
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
          message.error('Failed to fetch available slots');
        }
        setLoading(false);
      });
    }
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const { appointment_date, appointment_time, ...rest } = values;
      const formattedDate = appointment_date.format('YYYY-MM-DD');
      
      onSubmit({
        ...rest,
        appointment_date: formattedDate,
        appointment_time: appointment_time,
      });
    });
  };

  return (
    <Modal
      title="New Appointment"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Create
        </Button>,
      ]}
    >
      <Spin spinning={loading || servicesLoading}>
        <Form
          form={form}
          layout="vertical"
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
            label="Customer Phone"
            rules={[{ required: true, message: 'Please enter customer phone' }]}
          >
            <Input placeholder="Enter customer phone" />
          </Form.Item>
          
          <Form.Item
            name="service_id"
            label="Service"
            rules={[{ required: true, message: 'Please select a service' }]}
          >
            <Select 
              placeholder="Select service"
              onChange={handleServiceChange}
            >
              {services.map(service => (
                <Option key={service.id} value={service.id}>
                  {service.name} - {service.duration} min - {service.price} VND
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="employee_id"
            label="Employee"
            rules={[{ required: true, message: 'Please select an employee' }]}
          >
            <Select 
              placeholder="Select employee"
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
            label="Date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              onChange={handleEmployeeChange}
              disabled={!form.getFieldValue('employee_id')}
            />
          </Form.Item>
          
          <Form.Item
            name="appointment_time"
            label="Time"
            rules={[{ required: true, message: 'Please select a time' }]}
          >
            <Select 
              placeholder="Select time"
              disabled={!form.getFieldValue('appointment_date')}
            >
              {availableSlots.map(slot => (
                <Option key={slot.start_time} value={slot.start_time}>
                  {moment(slot.start_time, 'HH:mm:ss').format('HH:mm')} - {moment(slot.end_time, 'HH:mm:ss').format('HH:mm')}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default NewAppointmentModal; 