import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect, Dispatch } from 'umi';
import { ServiceModelState } from '@/models/management/service';
import { Employee } from '@/services/management/employee';
import styles from './index.less';

const { TextArea } = Input;
const { Option } = Select;

interface ServiceFormProps {
  visible: boolean;
  onCancel: () => void;
  dispatch: Dispatch;
  service: ServiceModelState;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ 
  visible, 
  onCancel, 
  dispatch, 
  service 
}) => {
  const [form] = Form.useForm();
  const { currentService, employees, loading } = service;
  const isEdit = !!currentService?.id;

  useEffect(() => {
    if (currentService && visible) {
      // Get employee IDs from the current service
      const employeeIds = currentService.employees?.map(emp => emp.id) || [];
      
      form.setFieldsValue({
        ...currentService,
        employee_ids: employeeIds,
      });
    } else {
      form.resetFields();
    }
  }, [currentService, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEdit) {
        dispatch({
          type: 'service/updateService',
          payload: {
            ...values,
            id: currentService?.id,
          },
        });
      } else {
        dispatch({
          type: 'service/createService',
          payload: values,
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const renderEmployeeSelection = () => {
    return (
      <div className={styles.employeeSelection}>
        <div className={styles.employeeLabel}>
          <span>Assigned Employees</span>
          <div className={styles.employeeHelp}>Select which employees can perform this service</div>
        </div>
        <Form.Item
          name="employee_ids"
          rules={[{ required: true, message: 'Please select at least one employee' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select employees"
            style={{ width: '100%' }}
            optionLabelProp="label"
          >
            {employees.map(emp => (
              <Option key={emp.id} value={emp.id} label={emp.name}>
                <div className={styles.employeeOption}>
                  <span>{emp.name}</span>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    );
  };

  return (
    <Modal
      title={isEdit ? 'Edit Service' : 'Add New Service'}
      visible={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {isEdit ? 'Update' : 'Create'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ price: 0, duration: 30 }}
      >
        <Form.Item
          name="name"
          label="Service Name"
          rules={[{ required: true, message: 'Please enter the service name' }]}
          help="Enter the name of the service"
        >
          <Input placeholder="Enter service name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          help="Optional description of the service"
        >
          <TextArea 
            rows={4} 
            placeholder="Describe the service details and what it includes..." 
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="price"
              label="Price ($)"
              rules={[{ required: true, message: 'Please enter the price' }]}
              help="Enter the service price"
            >
              <InputNumber
                min={0}
                step={0.01}
                precision={2}
                style={{ width: '100%' }}
                placeholder="0.00"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="duration"
              label="Duration (minutes)"
              rules={[{ required: true, message: 'Please enter the duration' }]}
              help="How long the service takes"
            >
              <InputNumber
                min={1}
                style={{ width: '100%' }}
                placeholder="30"
              />
            </Form.Item>
          </Col>
        </Row>

        {renderEmployeeSelection()}
      </Form>
    </Modal>
  );
};

export default connect(({ service }: { service: ServiceModelState }) => ({
  service,
}))(ServiceForm); 