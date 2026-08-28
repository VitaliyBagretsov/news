import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mediaApi } from '../api';
import { mediaQueryKeys } from './media.query-keys';

export const useCreateMediaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mediaApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mediaQueryKeys.root }),
  });
};
