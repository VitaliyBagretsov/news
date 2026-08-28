import { useQuery } from '@tanstack/react-query';

import { authApi } from '../api';
import { authQueryKeys } from './auth.query-keys';

export const useAuthSessionQuery = () =>
  useQuery({
    queryKey: authQueryKeys.session,
    queryFn: ({ signal }) => authApi.getSession(signal),
    retry: false,
  });
