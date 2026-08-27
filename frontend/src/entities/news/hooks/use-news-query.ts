import { useQuery } from '@tanstack/react-query';

import type { Query } from '@/shared/types';

import { newsApi } from '../api';
import type { News } from '../model';

export const useNewsQuery = (query: Query<News>) =>
  useQuery({
    queryKey: ['news', query],
    queryFn: ({ signal }) => newsApi.getAll(query, signal),
    enabled: Number.isInteger(query.filter?.mediaId),
  });
