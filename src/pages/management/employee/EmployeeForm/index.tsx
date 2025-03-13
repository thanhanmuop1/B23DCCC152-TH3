import React from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { connect } from 'umi';
import { Employee } from '@/models/management/types';
import styles from './index.less';

interface EmployeeFormProps {
  visible: boolean;
  onCancel: () => void;
  dispatch: (action: any) => void;
  employee: {
    currentEmployee: Employee | null;
    loading: boolean;
  };
}

interface WorkDay {
  label: string;
  value: string;
}

const workDayOptions: WorkDay[] = [
  { label: 'Thứ 2', value: '1' },
  { label: 'Thứ 3', value: '2' },
  { label: 'Thứ 4', value: '3' },
  { label: 'Thứ 5', value: '4' },
  { label: 'Thứ 6', value: '5' },
  { label: 'Thứ 7', value: '6' },
  { label: 'Chủ nhật', value: '0' },
];

const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  visible, 
  onCancel, 
  dispatch, 
  employee 
}) => {
  const [form] = Form.useForm();
  const { currentEmployee, loading } = employee;
  const isEdit = !!currentEmployee?.id;
  
  React.useEffect(() => {
    if (currentEmployee && visible) {
      form.setFieldsValue({
        ...currentEmployee,
        work_days: currentEmployee.work_days?.split(''),
      });
    } else {
      form.resetFields();
    }
  }, [currentEmployee, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        work_days: values.work_days.sort().join(''),
      };

      dispatch({
        type: isEdit ? 'employee/updateEmployee' : 'employee/createEmployee',
        payload: {
          ...formattedValues,
          id: currentEmployee?.id,
        },
        callback: () => {
          message.success(`${isEdit ? 'Cập nhật' : 'Thêm'} nhân viên thành công`);
          onCancel();
          dispatch({ type: 'employee/fetchEmployees' });
        },
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={`${isEdit ? 'Cập nhật' : 'Thêm'} nhân viên`}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        className={styles.form}
      >
        <Form.Item
          name="name"
          label="Tên nhân viên"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên' }]}
        >
          <Input placeholder="Nhập tên nhân viên" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại' },
            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="max_customers_per_day"
          label="Số khách tối đa/ngày"
          rules={[{ required: true, message: 'Vui lòng nhập số khách tối đa' }]}
        >
          <InputNumber 
            min={0} 
            placeholder="Nhập số khách tối đa" 
            style={{ width: '100%' }} 
          />
        </Form.Item>

        <Form.Item
          name="work_days"
          label="Lịch làm việc"
          rules={[{ required: true, message: 'Vui lòng chọn lịch làm việc' }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn ngày làm việc"
            options={workDayOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ employee }: { employee: any }) => ({
  employee,
}))(EmployeeForm); 