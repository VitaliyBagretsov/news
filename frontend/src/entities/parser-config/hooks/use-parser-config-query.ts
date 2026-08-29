import { useQuery } from '@tanstack/react-query';

import { parserConfigApi } from '../api';
import { parserConfigQueryKeys } from './parser-config.query-keys';

export const useParserConfigQuery = (mediaId: number) =>
  useQuery({
    queryKey: parserConfigQueryKeys.byMedia(mediaId),
    queryFn: ({ signal }) => parserConfigApi.get(mediaId, signal),
    enabled: Number.isInteger(mediaId) && mediaId > 0,
  });
