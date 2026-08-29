import { apiClient } from '@/shared/api';
import type { QueryResult } from '@/shared/types';

import type { CreateMedia, Media, MediaListItem, UpdateMedia } from '../model/media.types';

export const mediaApi = {
  create: async (media: CreateMedia): Promise<Media> => {
    const response = await apiClient.post<Media>('/media', media);

    return response.data;
  },

  getAll: async (signal?: AbortSignal): Promise<QueryResult<MediaListItem>> => {
    const response = await apiClient.get<QueryResult<MediaListItem>>('/media', {
      signal,
    });

    return response.data;
  },

  update: async (id: number, media: UpdateMedia): Promise<Media> => {
    const response = await apiClient.patch<Media>(`/media/${id}`, media);

    return response.data;
  },

  updateLogo: async (id: number, file: File): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<Media>(`/media/${id}/logo`, formData);

    return response.data;
  },

  removeLogo: async (id: number): Promise<Media> => {
    const response = await apiClient.delete<Media>(`/media/${id}/logo`);

    return response.data;
  },
};
