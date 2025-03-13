import React from 'react';
import { Card, DatePicker, Select, Row, Col, Spin } from 'antd';
import { Column } from '@ant-design/charts';
import moment from 'moment';
import { 
  AppointmentDailyStats, 
  AppointmentMonthlyStats 
} from '@/services/management/statistics';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface AppointmentStatsProps {
  data: AppointmentDailyStats[] | AppointmentMonthlyStats[];
  loading: boolean;
  onDateChange: (value: any) => void;
  viewType: 'daily' | 'monthly';
}

const AppointmentStats: React.FC<AppointmentStatsProps> = ({ 
  data, 
  loading, 
  onDateChange,
  viewType
}) => {
  const formatData = () => {
    if (viewType === 'daily') {
      return (data as AppointmentDailyStats[]).map(item => ({
        date: moment(item.date).format('DD/MM/YYYY'),
        type: 'Tổng',
        value: item.total_appointments,
      })).concat(
        (data as AppointmentDailyStats[]).map(item => ({
          date: moment(item.date).format('DD/MM/YYYY'),
          type: 'Hoàn thành',
          value: item.completed,
        }))
      ).concat(
        (data as AppointmentDailyStats[]).map(item => ({
          date: moment(item.date).format('DD/MM/YYYY'),
          type: 'Đã hủy',
          value: item.canceled,
        }))
      ).concat(
        (data as AppointmentDailyStats[]).map(item => ({
          date: moment(item.date).format('DD/MM/YYYY'),
          type: 'Chờ xác nhận',
          value: item.pending,
        }))
      );
    } else {
      const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ];
      
      return (data as AppointmentMonthlyStats[]).map(item => ({
        date: monthNames[item.month - 1],
        type: 'Tổng',
        value: item.total_appointments,
      })).concat(
        (data as AppointmentMonthlyStats[]).map(item => ({
          date: monthNames[item.month - 1],
          type: 'Hoàn thành',
          value: item.completed,
        }))
      ).concat(
        (data as AppointmentMonthlyStats[]).map(item => ({
          date: monthNames[item.month - 1],
          type: 'Đã hủy',
          value: item.canceled,
        }))
      ).concat(
        (data as AppointmentMonthlyStats[]).map(item => ({
          date: monthNames[item.month - 1],
          type: 'Chờ xác nhận',
          value: item.pending,
        }))
      );
    }
  };

  const config = {
    data: formatData(),
    isGroup: true,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
    color: ['#1890ff', '#52c41a', '#ff4d4f', '#faad14'],
  };

  return (
    <Card className={styles.statsCard}>
      <Row gutter={16} align="middle" className={styles.filterRow}>
        <Col>
          {viewType === 'daily' ? (
            <RangePicker 
              onChange={onDateChange}
              defaultValue={[
                moment().subtract(30, 'days'),
                moment()
              ]}
            />
          ) : (
            <Select 
              defaultValue={moment().year()} 
              style={{ width: 120 }}
              onChange={onDateChange}
            >
              {Array.from({ length: 5 }, (_, i) => moment().year() - i).map(year => (
                <Option key={year} value={year}>{year}</Option>
              ))}
            </Select>
          )}
        </Col>
      </Row>
      
      <Spin spinning={loading}>
        <div className={styles.chartContainer}>
          {data.length > 0 ? (
            <Column {...config} />
          ) : (
            <div className={styles.noData}>Không có dữ liệu</div>
          )}
        </div>
      </Spin>
    </Card>
  );
};

export default AppointmentStats; 