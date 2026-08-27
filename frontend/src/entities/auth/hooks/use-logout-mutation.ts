import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '../api';
import { authQueryKeys } from './auth.query-keys';

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authQueryKeys.session });
    },
  });
};
