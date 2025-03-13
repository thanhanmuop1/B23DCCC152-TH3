import React, { useEffect } from 'react';
import { Table, Button, Space, Tag, Tooltip, Modal, message } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect, Dispatch } from 'umi';
import { Employee } from '@/services/management/employee';
import { EmployeeModelState } from '@/models/management/employee';
import styles from './index.less';

interface EmployeeListProps {
  dispatch: Dispatch;
  employee: EmployeeModelState;
  onAddNew: () => void;
  onEdit: (record: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ 
  dispatch, 
  employee, 
  onAddNew, 
  onEdit 
}) => {
  const { employees, loading } = employee;
  
  useEffect(() => {
    dispatch({
      type: 'employee/fetchEmployees',
    });
  }, [dispatch]);
  
  const handleDelete = (id: number) => {
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
  
  const formatWorkDays = (workDays: string): string => {
    if (!workDays) return 'Không có lịch';
    
    const days: string[] = [];
    const daysMap: Record<string, string> = {
      '0': 'Chủ nhật',
      '1': 'Thứ 2',
      '2': 'Thứ 3',
      '3': 'Thứ 4',
      '4': 'Thứ 5',
      '5': 'Thứ 6',
      '6': 'Thứ 7',
    };
    
    workDays.split(',').forEach(day => {
      if (daysMap[day]) {
        days.push(daysMap[day]);
      }
    });
    
    return days.join(', ');
  };
  
  const formatWorkTime = (startTime?: string, endTime?: string): string => {
    if (!startTime || !endTime) return 'Không có giờ làm việc';
    return `${startTime} - ${endTime}`;
  };
  
  const getStatusTag = (currentCustomers: number = 0, maxCustomers: number = 0) => {
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
      title: 'Tên nhân viên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Employee, b: Employee) => a.name.localeCompare(b.name),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Lịch làm việc',
      key: 'schedule',
      render: (_, record: Employee) => (
        <Tooltip title={formatWorkTime(record.start_time, record.end_time)}>
          {formatWorkDays(record.work_days || '')}
        </Tooltip>
      ),
    },
    {
      title: 'Số khách tối đa/ngày',
      dataIndex: 'max_customers_per_day',
      key: 'max_customers_per_day',
      sorter: (a: Employee, b: Employee) => a.max_customers_per_day - b.max_customers_per_day,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: Employee) => 
        getStatusTag(record.current_customers, record.max_customers_per_day),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => {
                dispatch({
                  type: 'employee/fetchEmployeeById',
                  payload: record.id,
                });
                onEdit({ ...record, isView: true });
              }} 
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
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default connect(({ employee }: { employee: EmployeeModelState }) => ({
  employee,
}))(EmployeeList); 