import axios from 'axios';
import { useEffect, type PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { apiClient } from '@/shared/api';
import { routePaths } from '@/shared/config';

export const AuthRedirectProvider = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const interceptorId = apiClient.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401 &&
          location.pathname !== routePaths.login
        ) {
          navigate(routePaths.login, {
            replace: true,
            state: { from: `${location.pathname}${location.search}` },
          });
        }

        return Promise.reject(error);
      },
    );

    return () => apiClient.interceptors.response.eject(interceptorId);
  }, [location.pathname, location.search, navigate]);

  return children;
};
