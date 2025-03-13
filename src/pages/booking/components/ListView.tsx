import React, { useState } from 'react';
import { Table, Tag, Space, Button, Dropdown, Menu, DatePicker, Select, Tooltip } from 'antd';
import { DownOutlined, CheckOutlined, CloseOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { AppointmentData } from '../model';
import { useDispatch } from 'umi';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface ListViewProps {
  appointments: AppointmentData[];
  loading: boolean;
}

const ListView: React.FC<ListViewProps> = ({ appointments, loading }) => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const handleStatusChange = (id: number, status: string) => {
    dispatch({
      type: 'booking/updateStatus',
      payload: {
        id,
        status,
      },
    });
  };

  const handleDateRangeChange = (dates: [moment.Moment, moment.Moment] | null) => {
    setDateRange(dates);
    
    if (dates) {
      dispatch({
        type: 'booking/fetchAppointments',
        payload: {
          from_date: dates[0].format('YYYY-MM-DD'),
          to_date: dates[1].format('YYYY-MM-DD'),
        },
      });
    } else {
      dispatch({
        type: 'booking/fetchAppointments',
        payload: {
          from_date: undefined,
          to_date: undefined,
        },
      });
    }
  };

  const handleStatusFilterChange = (value: string | undefined) => {
    setStatusFilter(value);
    
    dispatch({
      type: 'booking/fetchAppointments',
      payload: {
        status: value,
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'processing';
      case 'canceled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckOutlined />;
      case 'pending':
        return <ClockCircleOutlined />;
      case 'completed':
        return <CheckCircleOutlined />;
      case 'canceled':
        return <CloseOutlined />;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'appointment_date',
      key: 'appointment_date',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
      sorter: (a: AppointmentData, b: AppointmentData) => {
        const dateA = moment(a.appointment_date).valueOf();
        const dateB = moment(b.appointment_date).valueOf();
        return dateA - dateB;
      },
    },
    {
      title: 'Time',
      key: 'time',
      render: (_, record: AppointmentData) => (
        <span>
          {moment(record.appointment_time, 'HH:mm:ss').format('HH:mm')} - {moment(record.end_time, 'HH:mm:ss').format('HH:mm')}
        </span>
      ),
      sorter: (a: AppointmentData, b: AppointmentData) => {
        const timeA = moment(a.appointment_time, 'HH:mm:ss').valueOf();
        const timeB = moment(b.appointment_time, 'HH:mm:ss').valueOf();
        return timeA - timeB;
      },
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record: AppointmentData) => (
        <Tooltip title={`Phone: ${record.customer_phone}`}>
          <span>{record.customer_name}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Service',
      key: 'service',
      render: (_, record: AppointmentData) => (
        <Tooltip title={`Duration: ${record.service_duration} min, Price: ${record.service_price} VND`}>
          <span>{record.service_name}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Employee',
      dataIndex: 'employee_name',
      key: 'employee_name',
      render: (name: string, record: AppointmentData) => (
        <Tooltip title={`Phone: ${record.employee_phone}`}>
          <span>{name}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'Completed', value: 'completed' },
        { text: 'Canceled', value: 'canceled' },
      ],
      onFilter: (value: string, record: AppointmentData) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: AppointmentData) => {
        const menu = (
          <Menu>
            <Menu.Item 
              key="confirm" 
              onClick={() => handleStatusChange(record.id, 'confirmed')}
              disabled={record.status === 'confirmed' || record.status === 'completed' || record.status === 'canceled'}
            >
              <CheckOutlined /> Confirm
            </Menu.Item>
            <Menu.Item 
              key="complete" 
              onClick={() => handleStatusChange(record.id, 'completed')}
              disabled={record.status === 'completed' || record.status === 'canceled'}
            >
              <CheckCircleOutlined /> Complete
            </Menu.Item>
            <Menu.Item 
              key="cancel" 
              onClick={() => handleStatusChange(record.id, 'canceled')}
              disabled={record.status === 'canceled' || record.status === 'completed'}
            >
              <CloseOutlined /> Cancel
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu}>
            <Button>
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <RangePicker 
          onChange={handleDateRangeChange}
          value={dateRange}
          format="DD/MM/YYYY"
        />
        <Select
          placeholder="Filter by status"
          style={{ width: 150 }}
          allowClear
          onChange={handleStatusFilterChange}
          value={statusFilter}
        >
          <Option value="pending">Pending</Option>
          <Option value="confirmed">Confirmed</Option>
          <Option value="completed">Completed</Option>
          <Option value="canceled">Canceled</Option>
        </Select>
      </Space>
      
      <Table
        columns={columns}
        dataSource={appointments}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
        summary={(pageData) => {
          const totalAppointments = pageData.length;
          const confirmedAppointments = pageData.filter(item => item.status === 'confirmed').length;
          const pendingAppointments = pageData.filter(item => item.status === 'pending').length;
          
          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>Total</Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={5}>
                  <Space>
                    <span>Total: {totalAppointments}</span>
                    <Tag color="success">Confirmed: {confirmedAppointments}</Tag>
                    <Tag color="warning">Pending: {pendingAppointments}</Tag>
                  </Space>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </div>
  );
};

export default ListView; 