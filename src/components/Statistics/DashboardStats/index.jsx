import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, DollarOutlined } from '@ant-design/icons';
import styles from './index.less';

const DashboardStats = ({ todayStats, monthStats }) => {
  return (
    <div className={styles.dashboardStats}>
      <Row gutter={16}>
        <Col span={12}>
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
                  value={todayStats.revenue || 0}
                  prefix={<DollarOutlined />}
                  suffix="đ"
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
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
                  value={monthStats.revenue}
                  prefix={<DollarOutlined />}
                  suffix="đ"
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardStats; 