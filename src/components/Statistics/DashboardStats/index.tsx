import React from 'react';
import { Row, Col, Card, Statistic, Divider } from 'antd';
import { 
  CalendarOutlined, 
  CheckCircleOutlined, 
  DollarOutlined 
} from '@ant-design/icons';
import styles from './index.less';

interface DashboardStatsProps {
  todayStats: {
    total_appointments: number;
    completed: number;
    revenue: string;
  };
  monthStats: {
    total_appointments: number;
    completed: number;
    revenue: string;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ todayStats, monthStats }) => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <Card title="Hôm nay" className={styles.statsCard}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="Tổng lịch hẹn"
                value={todayStats.total_appointments}
                prefix={<CalendarOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Đã hoàn thành"
                value={todayStats.completed}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Doanh thu"
                value={parseFloat(todayStats.revenue || '0')}
                precision={2}
                prefix={<DollarOutlined />}
                suffix="VND"
                valueStyle={{ color: '#cf1322' }}
              />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <Card title="Tháng này" className={styles.statsCard}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="Tổng lịch hẹn"
                value={monthStats.total_appointments}
                prefix={<CalendarOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Đã hoàn thành"
                value={monthStats.completed}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Doanh thu"
                value={parseFloat(monthStats.revenue || '0')}
                precision={2}
                prefix={<DollarOutlined />}
                suffix="VND"
                valueStyle={{ color: '#cf1322' }}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardStats; 