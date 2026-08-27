import { Alert, Spin } from 'antd';
import axios from 'axios';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthSessionQuery } from '@/entities/auth';
import { routePaths } from '@/shared/config';

export const ProtectedRoute = () => {
  const location = useLocation();
  const { error, isError, isPending } = useAuthSessionQuery();

  if (isPending) return <Spin fullscreen size="large" />;

  if (isError && axios.isAxiosError(error) && error.response?.status === 401) {
    return (
      <Navigate
        replace
        state={{ from: `${location.pathname}${location.search}` }}
        to={routePaths.login}
      />
    );
  }

  if (isError) {
    return <Alert message="Не удалось проверить авторизацию" type="error" />;
  }

  return <Outlet />;
};
