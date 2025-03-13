import React from 'react';
import { Calendar, Badge, Spin, Tooltip } from 'antd';
import { AppointmentData } from '../model';
import moment from 'moment';

interface CalendarViewProps {
  appointments: AppointmentData[];
  loading: boolean;
  onDateSelect: (date: moment.Moment) => void;
  selectedDate: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  appointments, 
  loading,
  onDateSelect,
  selectedDate
}) => {
  const dateCellRender = (date: moment.Moment) => {
    const formattedDate = date.format('YYYY-MM-DD');
    const dayAppointments = appointments.filter(
      app => moment(app.appointment_date).format('YYYY-MM-DD') === formattedDate
    );

    return (
      <ul className="events" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dayAppointments.slice(0, 3).map(appointment => (
          <li key={appointment.id} style={{ marginBottom: 3 }}>
            <Tooltip title={`${appointment.customer_name} - ${appointment.service_name}`}>
              <Badge 
                status={
                  appointment.status === 'confirmed' ? 'success' : 
                  appointment.status === 'pending' ? 'warning' :
                  appointment.status === 'completed' ? 'processing' : 'error'
                } 
                text={`${moment(appointment.appointment_time, 'HH:mm:ss').format('HH:mm')} - ${appointment.service_name.substring(0, 10)}${appointment.service_name.length > 10 ? '...' : ''}`} 
              />
            </Tooltip>
          </li>
        ))}
        {dayAppointments.length > 3 && (
          <li>
            <Badge status="processing" text={`+${dayAppointments.length - 3} more`} />
          </li>
        )}
      </ul>
    );
  };

  const handleSelect = (date: moment.Moment) => {
    onDateSelect(date);
  };

  return (
    <Spin spinning={loading}>
      <Calendar 
        dateCellRender={dateCellRender}
        onSelect={handleSelect}
        value={moment(selectedDate)}
      />
    </Spin>
  );
};

export default CalendarView; 