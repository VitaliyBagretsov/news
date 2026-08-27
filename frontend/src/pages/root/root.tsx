import { Layout, Menu, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { routePaths } from '@/shared/config';

import style from './style.module.scss';

const navigationItems = [
  { key: routePaths.home, label: 'Главная' },
  { key: routePaths.media, label: 'Медиа' },
];

const RootPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPath = navigationItems.find(({ key }) => key === location.pathname)?.key;

  return (
    <Layout className={style.layout}>
      <Layout.Header className={style.header}>
        <Typography.Title className={style.title} level={3}>
          News
        </Typography.Title>
        <Menu
          className={style.menu}
          items={navigationItems}
          mode="horizontal"
          onClick={({ key }) => navigate(key)}
          selectedKeys={selectedPath ? [selectedPath] : []}
          theme="dark"
        />
      </Layout.Header>
      <Layout.Content className={style.content}>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default RootPage;
