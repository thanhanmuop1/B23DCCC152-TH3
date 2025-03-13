import React from 'react';
import { Card, Table, DatePicker } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import styles from './index.less';

const { RangePicker } = DatePicker;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RevenueStats = ({ 
  data, 
  loading, 
  onDateChange, 
  type = 'service' // 'service' or 'employee'
}) => {
  // Chuyển đổi data cho biểu đồ
  const chartData = data.map(item => ({
    name: type === 'service' ? item.service_name : item.employee_name,
    value: item.total_revenue
  }));

  const columns = [
    {
      title: type === 'service' ? 'Dịch vụ' : 'Nhân viên',
      dataIndex: type === 'service' ? 'service_name' : 'employee_name',
      key: 'name',
    },
    {
      title: 'Tổng lịch hẹn',
      dataIndex: 'total_appointments',
      key: 'total_appointments',
    },
    {
      title: 'Hoàn thành',
      dataIndex: 'completed_appointments',
      key: 'completed_appointments',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'total_revenue',
      key: 'total_revenue',
      render: (value) => `${value.toLocaleString()}đ`,
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'white', padding: '10px', border: '1px solid #ccc' }}>
          <p>{`${payload[0].name}: ${payload[0].value.toLocaleString()}đ`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card 
      title={`Thống kê doanh thu theo ${type === 'service' ? 'dịch vụ' : 'nhân viên'}`}
      extra={<RangePicker onChange={onDateChange} />}
      className={styles.statsCard}
    >
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <Table 
        columns={columns} 
        dataSource={data} 
        loading={loading}
        rowKey={type === 'service' ? 'service_id' : 'employee_id'}
        pagination={false}
      />
    </Card>
  );
};

export default RevenueStats; 