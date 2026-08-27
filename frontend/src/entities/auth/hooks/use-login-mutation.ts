import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '../api';
import { authQueryKeys } from './auth.query-keys';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (session) => {
      queryClient.setQueryData(authQueryKeys.session, session);
    },
  });
};
