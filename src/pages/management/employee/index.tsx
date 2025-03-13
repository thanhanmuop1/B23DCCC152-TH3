import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import { Card } from 'antd';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import { Employee } from '@/services/management/employee';
import { EmployeeModelState } from '@/models/management/employee';

interface EmployeePageProps {
  dispatch: Dispatch;
  employee: EmployeeModelState;
}

const EmployeePage: React.FC<EmployeePageProps> = ({ dispatch, employee }) => {
  const [formVisible, setFormVisible] = useState(false);
  
  const handleAddNew = () => {
    dispatch({
      type: 'employee/setCurrentEmployee',
      payload: null,
    });
    setFormVisible(true);
  };
  
  const handleEdit = (record: Employee) => {
    dispatch({
      type: 'employee/setCurrentEmployee',
      payload: record,
    });
    setFormVisible(true);
  };
  
  const handleFormCancel = () => {
    setFormVisible(false);
  };

  return (
    <PageContainer title="Quản lý nhân viên">
      <Card>
        <EmployeeList 
          onAddNew={handleAddNew} 
          onEdit={handleEdit} 
        />
        
        <EmployeeForm 
          visible={formVisible} 
          onCancel={handleFormCancel} 
        />
      </Card>
    </PageContainer>
  );
};

export default connect(({ employee }: { employee: EmployeeModelState }) => ({
  employee,
}))(EmployeePage); 