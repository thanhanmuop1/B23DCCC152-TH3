import React, { useEffect } from 'react';
import { Table, Button, Space, Tag, Tooltip, Modal } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';

const EmployeeList = ({ dispatch, employee, loading, onAddNew, onEdit }) => {
  const { employees } = employee;
  
  useEffect(() => {
    dispatch({
      type: 'employee/fetchEmployees',
    });
  }, [dispatch]);
  
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa nhân viên này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        dispatch({
          type: 'employee/removeEmployee',
          payload: id,
        });
      },
    });
  };
  
  const formatWorkDays = (workDays) => {
    if (!workDays) return 'Không có lịch';
    
    const days = [];
    const daysMap = {
      '1': 'Thứ 2',
      '2': 'Thứ 3',
      '3': 'Thứ 4',
      '4': 'Thứ 5',
      '5': 'Thứ 6',
      '6': 'Thứ 7',
      '0': 'Chủ nhật',
    };
    
    workDays.split('').forEach(day => {
      if (daysMap[day]) {
        days.push(daysMap[day]);
      }
    });
    
    return days.join(', ');
  };
  
  const getStatusTag = (currentCustomers, maxCustomers) => {
    if (!maxCustomers) return <Tag color="default">Không hoạt động</Tag>;
    
    const ratio = currentCustomers / maxCustomers;
    if (ratio >= 1) {
      return <Tag color="red">Đã đầy</Tag>;
    } else if (ratio >= 0.7) {
      return <Tag color="orange">Gần đầy</Tag>;
    } else {
      return <Tag color="green">Còn trống</Tag>;
    }
  };
  
  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Lịch làm việc',
      key: 'schedule',
      render: (_, record) => (
        <span>
          {formatWorkDays(record.work_days)}: {record.start_time?.substring(0, 5)} - {record.end_time?.substring(0, 5)}
        </span>
      ),
    },
    {
      title: 'Giới hạn khách hàng',
      key: 'customerLimit',
      render: (_, record) => (
        <span>
          {record.current_customers || 0}/{record.max_customers_per_day || 0}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => getStatusTag(record.current_customers || 0, record.max_customers_per_day),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quản lý nhân viên</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onAddNew}
        >
          Thêm nhân viên
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={employees} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default connect(({ employee, loading }) => ({
  employee,
  loading: loading.effects['employee/fetchEmployees'],
}))(EmployeeList); 