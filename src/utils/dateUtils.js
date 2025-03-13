// Chuyển đổi giữa số và tên ngày trong tuần
export const dayNumberToName = (dayNumber) => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[dayNumber];
};

export const dayNameToNumber = (dayName) => {
  const dayMap = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
  };
  return dayMap[dayName];
};

// Định dạng thời gian làm việc
export const formatWorkSchedule = (employee) => {
  if (!employee || !employee.work_days) return '';
  
  // Chuyển đổi work_days từ chuỗi sang mảng số
  const workDays = typeof employee.work_days === 'string' 
    ? employee.work_days.split(',').map(day => parseInt(day.trim())) 
    : employee.work_days;
  
  // Sắp xếp ngày theo thứ tự
  const sortedDays = [...workDays].sort((a, b) => a - b);
  
  // Format lịch làm việc
  return sortedDays
    .map(day => `${dayNumberToName(day)}: ${employee.start_time}-${employee.end_time}`)
    .join(', ');
};

// Kiểm tra xem nhân viên có làm việc vào ngày hiện tại không
export const isWorkingToday = (employee) => {
  if (!employee || !employee.work_days) return false;
  
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
  
  // Chuyển đổi work_days từ chuỗi sang mảng số
  const workDays = typeof employee.work_days === 'string' 
    ? employee.work_days.split(',').map(day => parseInt(day.trim())) 
    : employee.work_days;
  
  return workDays.includes(today);
}; 