import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import EmployeeList from './EmployeeList/index';
import EmployeeForm from './EmployeeForm/index';
import { Button } from 'antd';

const EmployeePage = ({ employee, dispatch }) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  // Hàm này sẽ mở modal và set currentEmployee
  const handleAddOrEdit = (record = {}) => {
    dispatch({
      type: 'employee/setCurrentEmployee',
      payload: record,
    });
    setModalVisible(true);
  };
  
  const hideModal = () => {
    setModalVisible(false);
    dispatch({
      type: 'employee/setCurrentEmployee',
      payload: null,
    });
  };
  
  return (
    <PageContainer>
      <EmployeeList 
        onAddNew={() => handleAddOrEdit({})} 
        onEdit={handleAddOrEdit} 
      />
      <EmployeeForm 
        visible={modalVisible} 
        onCancel={hideModal}
      />
    </PageContainer>
  );
};

export default connect(({ employee }) => ({
  employee,
}))(EmployeePage); 