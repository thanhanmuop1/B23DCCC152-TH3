import React, { useState } from 'react';
import { Table, Tag, Space, Button, Dropdown, Menu, DatePicker, Select, Tooltip, List, Card, Spin } from 'antd';
import { DownOutlined, CheckOutlined, CloseOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { AppointmentData } from '../model';
import { useDispatch } from 'umi';
import AppointmentCard from './AppointmentCard';
import styles from './ListView.less';

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

  const handleStatusUpdate = (id: number, status: string) => {
    dispatch({
      type: 'booking/updateAppointmentStatus',
      payload: { id, status },
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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <Card className={styles.emptyCard}>
        <div className={styles.emptyText}>Không có lịch hẹn nào</div>
      </Card>
    );
  }

  return (
    <div>
      <div className={styles.filtersContainer}>
        <RangePicker 
          onChange={handleDateRangeChange}
          value={dateRange}
          format="DD/MM/YYYY"
          className={styles.dateFilter}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          onChange={handleStatusFilterChange}
          value={statusFilter}
          className={styles.statusFilter}
        >
          <Option value="pending">Chờ xác nhận</Option>
          <Option value="confirmed">Đã xác nhận</Option>
          <Option value="completed">Đã hoàn thành</Option>
          <Option value="canceled">Đã hủy</Option>
        </Select>
      </div>
      
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        dataSource={appointments}
        className={styles.listGrid}
        renderItem={appointment => (
          <List.Item>
            <AppointmentCard 
              appointment={appointment} 
              onStatusUpdate={handleStatusUpdate}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ListView; 