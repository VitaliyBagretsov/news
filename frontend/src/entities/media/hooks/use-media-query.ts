import { useQuery } from '@tanstack/react-query';

import { mediaApi } from '../api';

export const useMediaQuery = () =>
  useQuery({
    queryKey: ['media'],
    queryFn: ({ signal }) => mediaApi.getAll(signal),
  });
