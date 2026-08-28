import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mediaApi } from '../api';
import { mediaQueryKeys } from './media.query-keys';

interface UpdateMediaVariables {
  id: number;
  media: Parameters<typeof mediaApi.update>[1];
}

export const useUpdateMediaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, media }: UpdateMediaVariables) => mediaApi.update(id, media),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mediaQueryKeys.root }),
  });
};
