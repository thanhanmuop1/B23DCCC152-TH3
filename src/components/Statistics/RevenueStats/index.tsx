import React from 'react';
import { Card, DatePicker, Table, Row, Col, Spin } from 'antd';
import { Pie } from '@ant-design/charts';
import moment from 'moment';
import { 
  ServiceRevenueStats, 
  EmployeeRevenueStats 
} from '@/services/management/statistics';
import styles from './index.less';

const { RangePicker } = DatePicker;

interface RevenueStatsProps {
  data: ServiceRevenueStats[] | EmployeeRevenueStats[];
  loading: boolean;
  onDateChange: (dates: [moment.Moment, moment.Moment]) => void;
  type: 'service' | 'employee';
}

const RevenueStats: React.FC<RevenueStatsProps> = ({ 
  data, 
  loading, 
  onDateChange,
  type
}) => {
  const columns = type === 'service' 
    ? [
        {
          title: 'Dịch vụ',
          dataIndex: 'service_name',
          key: 'service_name',
        },
        {
          title: 'Tổng lịch hẹn',
          dataIndex: 'total_appointments',
          key: 'total_appointments',
          sorter: (a: ServiceRevenueStats, b: ServiceRevenueStats) => 
            a.total_appointments - b.total_appointments,
        },
        {
          title: 'Đã hoàn thành',
          dataIndex: 'completed_appointments',
          key: 'completed_appointments',
          sorter: (a: ServiceRevenueStats, b: ServiceRevenueStats) => 
            a.completed_appointments - b.completed_appointments,
        },
        {
          title: 'Doanh thu',
          dataIndex: 'total_revenue',
          key: 'total_revenue',
          render: (value: string) => `${parseFloat(value).toLocaleString()} VND`,
          sorter: (a: ServiceRevenueStats, b: ServiceRevenueStats) => 
            parseFloat(a.total_revenue) - parseFloat(b.total_revenue),
        },
      ]
    : [
        {
          title: 'Nhân viên',
          dataIndex: 'employee_name',
          key: 'employee_name',
        },
        {
          title: 'Tổng lịch hẹn',
          dataIndex: 'total_appointments',
          key: 'total_appointments',
          sorter: (a: EmployeeRevenueStats, b: EmployeeRevenueStats) => 
            a.total_appointments - b.total_appointments,
        },
        {
          title: 'Đã hoàn thành',
          dataIndex: 'completed_appointments',
          key: 'completed_appointments',
          sorter: (a: EmployeeRevenueStats, b: EmployeeRevenueStats) => 
            a.completed_appointments - b.completed_appointments,
        },
        {
          title: 'Doanh thu',
          dataIndex: 'total_revenue',
          key: 'total_revenue',
          render: (value: string) => `${parseFloat(value).toLocaleString()} VND`,
          sorter: (a: EmployeeRevenueStats, b: EmployeeRevenueStats) => 
            parseFloat(a.total_revenue) - parseFloat(b.total_revenue),
        },
      ];

  const pieData = data.map(item => ({
    type: type === 'service' 
      ? (item as ServiceRevenueStats).service_name 
      : (item as EmployeeRevenueStats).employee_name,
    value: parseFloat((item as any).total_revenue),
  }));

  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };

  return (
    <Card className={styles.statsCard}>
      <Row gutter={16} align="middle" className={styles.filterRow}>
        <Col>
          <RangePicker 
            onChange={(dates) => {
              if (dates) {
                onDateChange([dates[0], dates[1]]);
              }
            }}
            defaultValue={[
              moment().subtract(30, 'days'),
              moment()
            ]}
          />
        </Col>
      </Row>
      
      <Spin spinning={loading}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <div className={styles.chartContainer}>
              {data.length > 0 ? (
                <Pie {...pieConfig} />
              ) : (
                <div className={styles.noData}>Không có dữ liệu</div>
              )}
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Table 
              columns={columns} 
              dataSource={data} 
              rowKey={type === 'service' ? 'service_id' : 'employee_id'}
              pagination={false}
              size="small"
            />
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};

export default RevenueStats; 