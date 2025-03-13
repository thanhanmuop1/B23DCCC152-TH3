import React from 'react';
import { Table, Tag, Button, Space, Select, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import styles from './index.less';

const AppointmentListView = ({
  appointments,
  loading,
  currentDate,
  onDateChange,
  onFilterChange,
  handleUpdateStatus,
  formatTime,
  getStatusTag,
  getStatusText,
  employeeOptions,
  serviceOptions
}) => {
  // Cột cho bảng danh sách lịch hẹn
  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'appointment_date',
      key: 'appointment_date',
      render: (text) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Giờ',
      dataIndex: 'appointment_time',
      key: 'appointment_time',
      render: (text) => formatTime(text),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer_name',
      key: 'customer_name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'customer_phone',
      key: 'customer_phone',
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service_name',
      key: 'service_name',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employee_name',
      key: 'employee_name',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusTag(status)}>{getStatusText(status)}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => {
        if (record.status === 'pending') {
          return (
            <Space>
              <Button 
                type="primary" 
                size="small" 
                onClick={() => handleUpdateStatus(record.id, 'confirmed')}
              >
                Xác nhận
              </Button>
              <Button 
                danger 
                size="small" 
                onClick={() => handleUpdateStatus(record.id, 'canceled')}
              >
                Hủy
              </Button>
            </Space>
          );
        } else if (record.status === 'confirmed') {
          return (
            <Button 
              type="primary" 
              size="small" 
              onClick={() => handleUpdateStatus(record.id, 'completed')}
            >
              Hoàn thành
            </Button>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className={styles.listContainer}>
      <div className={styles.filters}>
        <Row gutter={16}>
          <Col>
            <Select
              placeholder="All Employees"
              style={{ width: 200 }}
              allowClear
              onChange={(value) => onFilterChange('employeeId', value)}
              options={employeeOptions}
            />
          </Col>
          <Col>
            <Select
              placeholder="All Services"
              style={{ width: 200 }}
              allowClear
              onChange={(value) => onFilterChange('serviceId', value)}
              options={serviceOptions}
            />
          </Col>
          <Col>
            <DatePicker 
              value={currentDate}
              onChange={onDateChange}
            />
          </Col>
        </Row>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={appointments} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AppointmentListView; 