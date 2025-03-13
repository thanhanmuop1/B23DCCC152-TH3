import React from 'react';
import { Card, Statistic, Row, Col, Progress } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import styles from './index.less';

const RatingStats = ({ stats }) => {
  const { total, average_rating } = stats;
  
  return (
    <Card className={styles.statsCard}>
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="Tổng số đánh giá"
            value={total}
            prefix={<StarOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Điểm trung bình"
            value={average_rating}
            precision={1}
            suffix="/10"
          />
        </Col>
        <Col span={8}>
          <Progress
            type="circle"
            percent={(average_rating / 10) * 100}
            format={() => `${average_rating}/10`}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default RatingStats; 