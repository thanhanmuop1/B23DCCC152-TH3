import React from 'react';
import { List, Rate, Card, Avatar, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';

const RatingList = ({ ratings, loading }) => {
  return (
    <List
      className={styles.ratingList}
      loading={loading}
      itemLayout="vertical"
      dataSource={ratings}
      renderItem={(item) => (
        <List.Item>
          <Card bordered={false}>
            <div className={styles.ratingHeader}>
              <Avatar icon={<UserOutlined />} />
              <div className={styles.userInfo}>
                <h4>{item.customer_name}</h4>
                <span>{moment(item.created_at).format('DD/MM/YYYY HH:mm')}</span>
              </div>
              <div className={styles.serviceInfo}>
                <Tag color="blue">{item.service_name}</Tag>
                <Tag color="green">{item.employee_name}</Tag>
              </div>
            </div>
            <div className={styles.ratingContent}>
              <Rate disabled value={item.rating} count={10} />
              <p>{item.comment}</p>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default RatingList; 