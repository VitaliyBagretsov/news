import { LogoutOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useLogoutMutation } from '@/entities/auth';
import { routePaths } from '@/shared/config';

const LogOut = () => {
  const navigate = useNavigate();
  const logout = useLogoutMutation();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate(routePaths.login, { replace: true }),
    });
  };

  return (
    <Button
      aria-label="Выйти"
      danger
      ghost
      icon={<LogoutOutlined />}
      loading={logout.isPending}
      onClick={handleLogout}
    >
      Выйти
    </Button>
  );
};

export default LogOut;
