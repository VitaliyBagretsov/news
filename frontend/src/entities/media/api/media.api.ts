import { apiClient } from '@/shared/api';
import type { QueryResult } from '@/shared/types';

import type { Media } from '../model/media.types';

export const mediaApi = {
  getAll: async (signal?: AbortSignal): Promise<QueryResult<Media>> => {
    const response = await apiClient.get<QueryResult<Media>>('/media', {
      signal,
    });

    return response.data;
  },
};
