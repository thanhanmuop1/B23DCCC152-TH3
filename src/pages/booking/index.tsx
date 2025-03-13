import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect, ConnectProps, Loading, useDispatch } from 'umi';
import { Button, Tabs, Row, Col, Card } from 'antd';
import { CalendarOutlined, UnorderedListOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';
import type moment from 'moment';
import CalendarView from './components/CalendarView';
import ListView from './components/ListView';
import DailyView from './components/DailyView';
import NewAppointmentModal from './components/NewAppointmentModal';
import type { BookingModelState } from './model';

interface BookingPageProps extends ConnectProps {
  booking: BookingModelState;
  loading: boolean;
}

const BookingPage: React.FC<BookingPageProps> = ({ booking, loading }) => {
  const dispatch = useDispatch();
  const [newAppointmentVisible, setNewAppointmentVisible] = useState(false);

  useEffect(() => {
    // Lấy lịch hẹn cho ngày hiện tại khi component mount
    dispatch({
      type: 'booking/fetchAppointments',
      payload: {
        from_date: booking.selectedDate,
        to_date: booking.selectedDate
      }
    });
  }, []);

  const handleViewChange = (key: string) => {
    dispatch({
      type: 'booking/setViewMode',
      payload: key,
    });
  };

  const handleDateChange = (date: moment.Moment | null) => {
    if (date) {
      dispatch({
        type: 'booking/changeDate',
        payload: date.format('YYYY-MM-DD'),
      });
    }
  };

  const handleFilterChange = (type: string, value: number | undefined) => {
    dispatch({
      type: 'booking/setFilters',
      payload: { [type]: value },
    });
    
    dispatch({
      type: 'booking/fetchAppointments',
    });
  };

  const handleNewAppointment = () => {
    setNewAppointmentVisible(true);
  };

  const handleNewAppointmentCancel = () => {
    setNewAppointmentVisible(false);
  };

  const handleNewAppointmentSubmit = (values: any) => {
    dispatch({
      type: 'booking/createNewAppointment',
      payload: values,
    }).then((response: any) => {
      if (response && response.success) {
        setNewAppointmentVisible(false);
      }
    });
  };

  return (
    <PageContainer
      title="Booking System"
      extra={[
        <Button 
          key="new" 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleNewAppointment}
        >
          New Appointment
        </Button>,
      ]}
    >
      <Card>
        <Tabs
          activeKey={booking.viewMode}
          onChange={handleViewChange}
          tabBarExtraContent={{
            right: <Button icon={<SettingOutlined />}>Settings</Button>,
          }}
        >
          <Tabs.TabPane
            tab={
              <span>
                <CalendarOutlined /> Calendar View
              </span>
            }
            key="calendar"
          >
            <CalendarView 
              appointments={booking.appointments}
              loading={loading}
              onDateSelect={handleDateChange}
              selectedDate={booking.selectedDate}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                <UnorderedListOutlined /> List View
              </span>
            }
            key="list"
          >
            <ListView 
              appointments={booking.appointments}
              loading={loading}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <DailyView 
            appointments={booking.appointments}
            loading={loading}
            selectedDate={booking.selectedDate}
            onDateChange={handleDateChange}
            onFilterChange={handleFilterChange}
            filters={booking.filters}
            onAddAppointment={handleNewAppointment}
          />
        </Col>
      </Row>

      <NewAppointmentModal
        visible={newAppointmentVisible}
        onCancel={handleNewAppointmentCancel}
        onSubmit={handleNewAppointmentSubmit}
        selectedDate={booking.selectedDate}
      />
    </PageContainer>
  );
};

export default connect(({ booking, loading }: { 
  booking: BookingModelState;
  loading: Loading;
}) => ({
  booking,
  loading: loading.models.booking,
}))(BookingPage);