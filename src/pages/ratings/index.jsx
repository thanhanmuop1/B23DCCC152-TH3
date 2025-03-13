import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs, Select, Pagination, Empty, message } from 'antd';
import * as ratingService from '@/services/management/ratings';
import * as employeeService from '@/services/management/employee';
import * as serviceService from '@/services/management/service';
import RatingList from '@/components/Ratings/RatingList';
import RatingStats from '@/components/Ratings/RatingStats';
import styles from './index.less';
import * as ratingsModel from '@/models/management/ratings';

const { TabPane } = Tabs;

const RatingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('service');
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState({
    ratings: [],
    total: 0,
    average_rating: 0,
    current_page: 1,
    total_pages: 1
  });
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  useEffect(() => {
    ratingsModel.fetchOptionsData(setServices, setEmployees, setOptionsLoading);
    console.log('services', services);
    console.log('employees', employees);
  }, []);

  useEffect(() => {
    if (selectedId) {
      ratingsModel.fetchRatingData(
        activeTab,
        selectedId,
        page,
        pageSize,
        setData,
        setLoading
      );
    }
  }, [selectedId, page, pageSize, activeTab]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSelectedId(null);
    setPage(1);
  };

  const handleSelect = (value) => {
    setSelectedId(value);
    setPage(1);
  };

  return (
    <PageContainer>
      <Card className={styles.ratingContainer}>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="Đánh giá theo dịch vụ" key="service">
            <Select
              placeholder="Chọn dịch vụ"
              style={{ width: 200, marginBottom: 16 }}
              onChange={handleSelect}
              options={ratingsModel.formatServiceOptions(services)}
              loading={optionsLoading}
              allowClear
            />
          </TabPane>
          <TabPane tab="Đánh giá theo nhân viên" key="employee">
            <Select
              placeholder="Chọn nhân viên"
              style={{ width: 200, marginBottom: 16 }}
              onChange={handleSelect}
              options={ratingsModel.formatEmployeeOptions(employees)}
              loading={optionsLoading}
              allowClear
            />
          </TabPane>
        </Tabs>

        {selectedId ? (
          <>
            <RatingStats stats={data} />
            <RatingList ratings={data.ratings} loading={loading} />
            <div className={styles.pagination}>
              <Pagination
                current={data.current_page}
                total={data.total}
                pageSize={pageSize}
                onChange={(page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
                }}
                showSizeChanger
                showTotal={(total) => `Tổng ${total} đánh giá`}
              />
            </div>
          </>
        ) : (
          <Empty description="Vui lòng chọn dịch vụ hoặc nhân viên để xem đánh giá" />
        )}
      </Card>
    </PageContainer>
  );
};

export default RatingsPage; 