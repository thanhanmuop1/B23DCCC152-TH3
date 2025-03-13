import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect, Dispatch } from 'umi';
import ServiceList from './components/ServiceList';
import ServiceForm from './components/ServiceForm';
import { ServiceModelState } from '@/models/management/service';
import styles from './index.less';

interface ServicePageProps {
  dispatch: Dispatch;
  service: ServiceModelState;
}

const ServicePage: React.FC<ServicePageProps> = ({ dispatch, service }) => {
  const { modalVisible, currentService } = service;

  useEffect(() => {
    dispatch({ type: 'service/fetchServices' });
    dispatch({ type: 'service/fetchEmployees' });
  }, [dispatch]);

  const handleAddService = () => {
    dispatch({ type: 'service/setCurrentService', payload: null });
    dispatch({ type: 'service/setModalVisible', payload: true });
  };

  const handleEditService = (id: number) => {
    dispatch({ type: 'service/fetchServiceById', payload: id });
    dispatch({ type: 'service/setModalVisible', payload: true });
  };

  const handleDeleteService = (id: number) => {
    dispatch({ type: 'service/removeService', payload: id });
  };

  const handleModalCancel = () => {
    dispatch({ type: 'service/setModalVisible', payload: false });
  };

  return (
    <PageContainer
      title="Service Management"
      subTitle="Create, edit, and manage services offered by your business"
      extra={[
        <Button 
          key="add" 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddService}
        >
          Add New Service
        </Button>,
      ]}
    >
      <Card className={styles.card}>
        <ServiceList 
          onEdit={handleEditService} 
          onDelete={handleDeleteService} 
        />
      </Card>

      <ServiceForm 
        visible={modalVisible} 
        onCancel={handleModalCancel} 
      />
    </PageContainer>
  );
};

export default connect(({ service }: { service: ServiceModelState }) => ({
  service,
}))(ServicePage); 