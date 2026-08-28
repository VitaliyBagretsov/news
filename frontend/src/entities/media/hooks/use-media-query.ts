import { useQuery } from '@tanstack/react-query';

import { mediaApi } from '../api';
import { mediaQueryKeys } from './media.query-keys';

export const useMediaQuery = () =>
  useQuery({
    queryKey: mediaQueryKeys.all,
    queryFn: ({ signal }) => mediaApi.getAll(signal),
  });
