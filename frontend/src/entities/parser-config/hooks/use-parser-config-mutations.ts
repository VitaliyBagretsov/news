import { useMutation, useQueryClient } from '@tanstack/react-query';

import { parserConfigApi } from '../api';
import type { UpdateParserConfig } from '../model';
import { parserConfigQueryKeys } from './parser-config.query-keys';

export const useParserConfigMutations = (mediaId: number) => {
  const queryClient = useQueryClient();

  return {
    preview: useMutation({
      mutationFn: (config: UpdateParserConfig) => parserConfigApi.preview(mediaId, config),
    }),
    update: useMutation({
      mutationFn: (config: UpdateParserConfig) => parserConfigApi.update(mediaId, config),
      onSuccess: (config) =>
        queryClient.setQueryData(parserConfigQueryKeys.byMedia(mediaId), config),
    }),
  };
};
