import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, TimePicker, Checkbox, Switch, Button } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import styles from './index.less';

const EmployeeForm = ({ dispatch, employee, visible, onCancel }) => {
  const { currentEmployee } = employee;
  const [form] = Form.useForm();
  const isEdit = currentEmployee && currentEmployee.id;
  
  useEffect(() => {
    if (currentEmployee && visible) {
      // Format data for form
      const formData = {
        ...currentEmployee,
        start_date: currentEmployee.created_at ? moment(currentEmployee.created_at) : null,
        start_time: currentEmployee.start_time ? moment(currentEmployee.start_time, 'HH:mm:ss') : null,
        end_time: currentEmployee.end_time ? moment(currentEmployee.end_time, 'HH:mm:ss') : null,
        work_days: currentEmployee.work_days ? currentEmployee.work_days.split('').map(Number) : [],
      };
      form.setFieldsValue(formData);
    } else {
      form.resetFields();
    }
  }, [currentEmployee, visible, form]);
  
  const handleSubmit = () => {
    form.validateFields().then(values => {
      // Format data for API
      const formattedValues = {
        ...values,
        created_at: values.start_date ? values.start_date.format('YYYY-MM-DD') : null,
        start_time: values.start_time ? values.start_time.format('HH:mm:ss') : null,
        end_time: values.end_time ? values.end_time.format('HH:mm:ss') : null,
        work_days: values.work_days ? values.work_days.join('') : '',
      };
      console.log('formattedValues', formattedValues);
      // Remove unnecessary fields
      delete formattedValues.start_date;
      
      if (isEdit) {
        dispatch({
          type: 'employee/updateEmployee',
          payload: {
            id: currentEmployee.id,
            data: formattedValues,
          },
        });
      } else {
        dispatch({
          type: 'employee/addEmployee',
          payload: formattedValues,
        });
      }
      
      onCancel();
    });
  };
  
  const workDaysOptions = [
    { label: 'Thứ 2', value: 1 },
    { label: 'Thứ 3', value: 2 },
    { label: 'Thứ 4', value: 3 },
    { label: 'Thứ 5', value: 4 },
    { label: 'Thứ 6', value: 5 },
    { label: 'Thứ 7', value: 6 },
    { label: 'Chủ nhật', value: 0 },
  ];
  console.log('visible', visible);
  return (
    <Modal
      title={isEdit ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {isEdit ? 'Cập nhật' : 'Tạo mới'}
        </Button>,
      ]}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        className={styles.form}
      >
        <div className={styles.formSection}>
          <h3>Thông tin cá nhân</h3>
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên' }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          
          <Form.Item
            name="start_date"
            label="Ngày bắt đầu"
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </div>
        
        <div className={styles.formSection}>
          <h3>Thông tin công việc</h3>
          <Form.Item
            name="max_customers_per_day"
            label="Giới hạn khách hàng mỗi ngày"
            rules={[{ required: true, message: 'Vui lòng nhập giới hạn khách hàng' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số lượng tối đa" />
          </Form.Item>
          
          <Form.Item
            name="work_days"
            label="Ngày làm việc"
          >
            <Checkbox.Group options={workDaysOptions} />
          </Form.Item>
          
          <div className={styles.timeRow}>
            <Form.Item
              name="start_time"
              label="Giờ bắt đầu"
              className={styles.timeField}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="end_time"
              label="Giờ kết thúc"
              className={styles.timeField}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default connect(({ employee }) => ({
  employee,
}))(EmployeeForm); 