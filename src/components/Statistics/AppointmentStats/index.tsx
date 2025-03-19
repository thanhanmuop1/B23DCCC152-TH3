import React from 'react';
import { Card, Table, DatePicker } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import styles from './index.less';

const { RangePicker } = DatePicker;

const AppointmentStats = ({ 
  data, 
  loading, 
  onDateChange, 
  viewType = 'daily' // 'daily' or 'monthly'
}) => {
  // Chuyển đổi data cho biểu đồ
  const chartData = data.map(item => ({
    name: viewType === 'daily' ? moment(item.date).format('DD/MM') : `T${item.month}`,
    'Đã hoàn thành': item.completed,
    'Đã hủy': item.canceled,
    'Đang chờ': item.pending
  }));

  const columns = [
    {
      title: viewType === 'daily' ? 'Ngày' : 'Tháng',
      dataIndex: viewType === 'daily' ? 'date' : 'month',
      key: viewType === 'daily' ? 'date' : 'month',
      render: (text) => viewType === 'daily' 
        ? moment(text).format('DD/MM/YYYY')
        : `Tháng ${text}`,
    },
    {
      title: 'Tổng lịch hẹn',
      dataIndex: 'total_appointments',
      key: 'total_appointments',
    },
    {
      title: 'Hoàn thành',
      dataIndex: 'completed',
      key: 'completed',
    },
    {
      title: 'Đã hủy',
      dataIndex: 'canceled',
      key: 'canceled',
    },
    {
      title: 'Đang chờ',
      dataIndex: 'pending',
      key: 'pending',
    },
  ];

  return (
    <Card 
      title={`Thống kê lịch hẹn ${viewType === 'daily' ? 'theo ngày' : 'theo tháng'}`}
      extra={
        viewType === 'daily' ? (
          <RangePicker onChange={onDateChange} />
        ) : (
          <DatePicker 
            picker="year" 
            onChange={(date) => onDateChange(date.year())} 
          />
        )
      }
      className={styles.statsCard}
    >
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Đã hoàn thành" fill="#52c41a" />
            <Bar dataKey="Đã hủy" fill="#ff4d4f" />
            <Bar dataKey="Đang chờ" fill="#faad14" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Table 
        columns={columns} 
        dataSource={data} 
        loading={loading}
        rowKey={viewType === 'daily' ? 'date' : 'month'}
        pagination={false}
      />
    </Card>
  );
};

export default AppointmentStats; 