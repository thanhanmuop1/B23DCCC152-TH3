import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import moment from 'moment';
import * as statisticsModel from '@/models/management/statistics';
import DashboardStats from '@/components/Statistics/DashboardStats';
import AppointmentStats from '@/components/Statistics/AppointmentStats';
import RevenueStats from '@/components/Statistics/RevenueStats';
import styles from './index.less';

const { TabPane } = Tabs;

const StatisticsPage = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({ today: {}, month: {} });
  const [appointmentStats, setAppointmentStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [serviceRevenue, setServiceRevenue] = useState([]);
  const [employeeRevenue, setEmployeeRevenue] = useState([]);

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      await statisticsModel.fetchDashboardStats(setDashboardStats);
      
      const { startDate, endDate } = statisticsModel.getDefaultDateRange();
      
      await Promise.all([
        statisticsModel.fetchAppointmentStats(startDate, endDate, setAppointmentStats, setLoading),
        statisticsModel.fetchMonthlyStats(moment().year(), setMonthlyStats, setLoading),
        statisticsModel.fetchRevenueStats(
          startDate, 
          endDate, 
          setServiceRevenue, 
          setEmployeeRevenue, 
          setLoading
        ),
      ]);
    };

    loadInitialData();
  }, []);

  return (
    <PageContainer>
      <DashboardStats 
        todayStats={dashboardStats.today} 
        monthStats={dashboardStats.month} 
      />
      
      <Card className={styles.statsContainer}>
        <Tabs defaultActiveKey="daily">
          <TabPane tab="Thống kê theo ngày" key="daily">
            <AppointmentStats
              data={appointmentStats}
              loading={loading}
              onDateChange={(dates) => {
                if (dates) {
                  statisticsModel.fetchAppointmentStats(
                    dates[0].format('YYYY-MM-DD'),
                    dates[1].format('YYYY-MM-DD'),
                    setAppointmentStats,
                    setLoading
                  );
                }
              }}
              viewType="daily"
            />
          </TabPane>
          
          <TabPane tab="Thống kê theo tháng" key="monthly">
            <AppointmentStats
              data={monthlyStats}
              loading={loading}
              onDateChange={(year) => statisticsModel.fetchMonthlyStats(year, setMonthlyStats, setLoading)}
              viewType="monthly"
            />
          </TabPane>
          
          <TabPane tab="Doanh thu theo dịch vụ" key="service">
            <RevenueStats
              data={serviceRevenue}
              loading={loading}
              onDateChange={(dates) => {
                if (dates) {
                  statisticsModel.fetchRevenueStats(
                    dates[0].format('YYYY-MM-DD'),
                    dates[1].format('YYYY-MM-DD'),
                    setServiceRevenue,
                    setEmployeeRevenue,
                    setLoading
                  );
                }
              }}
              type="service"
            />
          </TabPane>
          
          <TabPane tab="Doanh thu theo nhân viên" key="employee">
            <RevenueStats
              data={employeeRevenue}
              loading={loading}
              onDateChange={(dates) => {
                if (dates) {
                  statisticsModel.fetchRevenueStats(
                    dates[0].format('YYYY-MM-DD'),
                    dates[1].format('YYYY-MM-DD'),
                    setServiceRevenue,
                    setEmployeeRevenue,
                    setLoading
                  );
                }
              }}
              type="employee"
            />
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};

export default StatisticsPage; 