import { UserOutlined } from '@ant-design/icons';
import { Avatar, Typography } from 'antd';

import { useAuthSessionQuery } from '@/entities/auth';

import style from './style.module.scss';

const UserInfo = () => {
  const { data } = useAuthSessionQuery();
  const user = data?.user;

  if (!user) return null;

  return (
    <div className={style.user} title={user.email}>
      <Avatar icon={<UserOutlined />} size="small" />
      <Typography.Text className={style.name}>{user.name || user.username}</Typography.Text>
    </div>
  );
};

export default UserInfo;
