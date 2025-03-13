import React from 'react';
import { Calendar, Button, Select, Row, Col, Spin, Empty } from 'antd';
import { LeftOutlined, RightOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import AppointmentCard from '../AppointmentCard';
import styles from './index.less';

const AppointmentCalendar = ({
  appointments,
  currentDate,
  onDateChange,
  calendarView,
  onViewChange,
  loading,
  onAddNew,
  onUpdateStatus,
  formatTime,
  getStatusColor,
  getStatusText,
  getAppointmentsForHour,
  generateTimeSlots,
}) => {
  // Render mini calendar
  const renderCalendarCell = (date) => {
    const cellDate = date.format('YYYY-MM-DD');
    const dayAppointments = appointments.filter(app => 
      moment(app.appointment_date).format('YYYY-MM-DD') === cellDate
    );
    
    return (
      <div className={styles.calendarCell}>
        <div className={styles.cellDate}>{date.date()}</div>
        {dayAppointments.length > 0 && (
          <div className={styles.appointmentCount}>
            {dayAppointments.length} lịch hẹn
          </div>
        )}
      </div>
    );
  };
  
  // Tạo các khung giờ
  const timeSlots = generateTimeSlots();
  
  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <div className={styles.dateNavigation}>
          <Button 
            icon={<LeftOutlined />} 
            onClick={() => onDateChange(moment(currentDate).subtract(1, 'day'))}
          />
          <h2>{currentDate.format('dddd, MMMM D, YYYY')}</h2>
          <Button 
            icon={<RightOutlined />} 
            onClick={() => onDateChange(moment(currentDate).add(1, 'day'))}
          />
        </div>
        
        <div className={styles.viewOptions}>
          <Select 
            value={calendarView} 
            onChange={onViewChange}
            options={[
              { value: 'day', label: 'Day' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
            ]}
          />
        </div>
      </div>
      
      {calendarView === 'day' ? (
        <div className={styles.dayView}>
          <Spin spinning={loading}>
            <div className={styles.miniCalendar}>
              <Calendar 
                fullscreen={false} 
                value={currentDate}
                onSelect={onDateChange}
                dateFullCellRender={renderCalendarCell}
              />
            </div>
            
            <div className={styles.daySchedule}>
              <h3>Appointments</h3>
              <div className={styles.scheduleSubtitle}>Daily schedule</div>
              
              {timeSlots.map((hour) => {
                const hourFormatted = hour.split(':')[0];
                const hourAppointments = getAppointmentsForHour(appointments, hourFormatted);
                
                return (
                  <div key={hour} className={styles.timeSlot}>
                    <div className={styles.timeLabel}>
                      <ClockCircleOutlined /> {hour}
                    </div>
                    <div className={styles.appointmentsContainer}>
                      {hourAppointments.length > 0 ? (
                        hourAppointments.map(app => (
                          <AppointmentCard 
                            key={app.id}
                            appointment={app}
                            onUpdateStatus={onUpdateStatus}
                            formatTime={formatTime}
                            getStatusColor={getStatusColor}
                            getStatusText={getStatusText}
                          />
                        ))
                      ) : (
                        <div className={styles.emptySlot}>
                          No appointments
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Spin>
        </div>
      ) : (
        <div className={styles.monthView}>
          <Calendar 
            value={currentDate}
            onSelect={onDateChange}
            dateCellRender={(date) => {
              const cellDate = date.format('YYYY-MM-DD');
              const dayAppointments = appointments.filter(app => 
                moment(app.appointment_date).format('YYYY-MM-DD') === cellDate
              );
              
              return (
                <ul className={styles.appointmentList}>
                  {dayAppointments.map(app => (
                    <li key={app.id}>
                      <div 
                        className={`${styles.appointmentItem} ${styles[app.status]}`}
                        style={{ backgroundColor: getStatusColor(app.status) }}
                      >
                        {formatTime(app.appointment_time)} - {app.service_name}
                      </div>
                    </li>
                  ))}
                </ul>
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar; 