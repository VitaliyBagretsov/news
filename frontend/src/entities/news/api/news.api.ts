import { apiClient } from '@/shared/api';
import type { Query, QueryResult } from '@/shared/types';

import type { News } from '../model';

export const newsApi = {
  getAll: async (query: Query<News>, signal?: AbortSignal): Promise<QueryResult<News>> => {
    const response = await apiClient.get<QueryResult<News>>('/news', {
      params: {
        'filter[mediaId]': query.filter?.mediaId,
        'sort[date]': query.sort?.date,
        page: query.page,
        limit: query.limit,
      },
      signal,
    });

    return response.data;
  },
};
