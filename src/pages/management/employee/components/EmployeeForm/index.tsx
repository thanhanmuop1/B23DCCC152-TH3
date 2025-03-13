import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, TimePicker, message } from 'antd';
import { connect, Dispatch } from 'umi';
import moment from 'moment';
import { Employee } from '@/services/management/employee';
import { EmployeeModelState } from '@/models/management/employee';
import styles from './index.less';

interface EmployeeFormProps {
  visible: boolean;
  onCancel: () => void;
  dispatch: Dispatch;
  employee: EmployeeModelState;
}

interface WorkDay {
  label: string;
  value: number;
}

const workDayOptions: WorkDay[] = [
  { label: 'Chủ nhật', value: 0 },
  { label: 'Thứ 2', value: 1 },
  { label: 'Thứ 3', value: 2 },
  { label: 'Thứ 4', value: 3 },
  { label: 'Thứ 5', value: 4 },
  { label: 'Thứ 6', value: 5 },
  { label: 'Thứ 7', value: 6 },
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
  const isView = currentEmployee?.isView;
  
  useEffect(() => {
    if (currentEmployee && visible) {
      // Xử lý work_days từ chuỗi thành mảng số
      const workDays = currentEmployee.work_days 
        ? currentEmployee.work_days.split(',').map(day => parseInt(day, 10)) 
        : [];
      
      // Xử lý thời gian làm việc
      const startTime = currentEmployee.start_time ? moment(currentEmployee.start_time, 'HH:mm:ss') : null;
      const endTime = currentEmployee.end_time ? moment(currentEmployee.end_time, 'HH:mm:ss') : null;
      
      form.setFieldsValue({
        ...currentEmployee,
        work_days: workDays,
        work_time: [startTime, endTime].filter(Boolean),
      });
    } else {
      form.resetFields();
    }
  }, [currentEmployee, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Xử lý work_days từ mảng số thành chuỗi
      const workDays = values.work_days.sort((a, b) => a - b).join(',');
       //chuyển thành array
      const workDaysArray = workDays.split(',').map(day => parseInt(day, 10));

      // Xử lý thời gian làm việc
      let startTime, endTime;
      if (values.work_time && values.work_time.length === 2) {
        startTime = values.work_time[0].format('HH:mm:ss');
        endTime = values.work_time[1].format('HH:mm:ss');
      }
      
      const formattedValues = {
        ...values,
        work_days: workDaysArray,
        start_time: startTime,
        end_time: endTime,
      };
      
      // Xóa trường work_time vì backend không cần
      delete formattedValues.work_time;
      
      dispatch({
        type: isEdit ? 'employee/updateEmployee' : 'employee/createEmployee',
        payload: {
          ...formattedValues,
          id: currentEmployee?.id,
        },
        callback: () => {
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
      title={isView ? 'Chi tiết nhân viên' : (isEdit ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới')}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      okButtonProps={{ disabled: isView }}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        className={styles.form}
        disabled={isView}
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
            min={1} 
            placeholder="Nhập số khách tối đa" 
            style={{ width: '100%' }} 
          />
        </Form.Item>

        <Form.Item
          name="work_days"
          label="Ngày làm việc"
          rules={[{ required: true, message: 'Vui lòng chọn ngày làm việc' }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn ngày làm việc"
            options={workDayOptions}
          />
        </Form.Item>

        <Form.Item
          name="work_time"
          label="Giờ làm việc"
          rules={[{ required: true, message: 'Vui lòng chọn giờ làm việc' }]}
        >
          <TimePicker.RangePicker 
            format="HH:mm"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ employee }: { employee: EmployeeModelState }) => ({
  employee,
}))(EmployeeForm); 