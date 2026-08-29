import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mediaApi } from '../api';
import { mediaQueryKeys } from './media.query-keys';

export const useUpdateMediaLogoMutation = () => {
  const queryClient = useQueryClient();

  const invalidateMedia = () => queryClient.invalidateQueries({ queryKey: mediaQueryKeys.root });

  return {
    removeLogo: useMutation({ mutationFn: mediaApi.removeLogo, onSuccess: invalidateMedia }),
    updateLogo: useMutation({
      mutationFn: ({ file, id }: { file: File; id: number }) => mediaApi.updateLogo(id, file),
      onSuccess: invalidateMedia,
    }),
  };
};
