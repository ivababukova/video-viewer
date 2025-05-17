import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { VideoCameraOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const AppLayout: React.FC = () => {
  const location = useLocation();
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <VideoCameraOutlined style={{ fontSize: '24px', color: 'white', marginRight: '16px' }} />
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            Video Library
          </Title>
        </div>
        <Menu 
          theme="dark" 
          mode="horizontal" 
          selectedKeys={[location.pathname]} 
          style={{ marginLeft: '32px', flex: 1 }}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
        </Menu>
      </Header>
      
      <Content style={{ background: '#f0f2f5' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        Video Library App ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default AppLayout;