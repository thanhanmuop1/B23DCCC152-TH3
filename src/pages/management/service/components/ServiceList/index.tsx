import React from 'react';
import { Table, Tag, Space, Button, Dropdown, Menu, Typography } from 'antd';
import { EllipsisOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect, Dispatch } from 'umi';
import { ServiceModelState } from '@/models/management/service';
import { ServiceWithEmployees } from '@/services/management/service';
import styles from './index.less';

const { Title } = Typography;

interface ServiceListProps {
  dispatch: Dispatch;
  service: ServiceModelState;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ 
  dispatch, 
  service, 
  onEdit, 
  onDelete 
}) => {
  const { services, loading } = service;

  const handleAddService = () => {
    dispatch({ type: 'service/setCurrentService', payload: null });
    dispatch({ type: 'service/setModalVisible', payload: true });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => `$${parseFloat(price).toFixed(2)}`,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration} min`,
    },
    {
      title: 'Assigned Employees',
      dataIndex: 'employees',
      key: 'employees',
      render: (employees: any[]) => (
        <Space size={[0, 8]} wrap>
          {employees && employees.map(emp => (
            <Tag key={emp.id} color="blue">{emp.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ServiceWithEmployees) => {
        const menu = (
          <Menu>
            <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => onEdit(record.id)}>
              Edit
            </Menu.Item>
            <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => onDelete(record.id)}>
              Delete
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={4}>Services</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddService}
        >
          Add Service
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={services} 
        loading={loading}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default connect(({ service }: { service: ServiceModelState }) => ({
  service,
}))(ServiceList); 