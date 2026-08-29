import { apiClient } from '@/shared/api';

import type { ParserConfig, ParserPreview, UpdateParserConfig } from '../model';

export const parserConfigApi = {
  get: async (mediaId: number, signal?: AbortSignal): Promise<ParserConfig | null> => {
    const response = await apiClient.get<ParserConfig | null>(`/media/${mediaId}/parser-config`, {
      signal,
    });
    return response.data;
  },

  update: async (mediaId: number, config: UpdateParserConfig): Promise<ParserConfig> => {
    const response = await apiClient.put<ParserConfig>(`/media/${mediaId}/parser-config`, config);
    return response.data;
  },

  preview: async (mediaId: number, config: UpdateParserConfig): Promise<ParserPreview> => {
    const response = await apiClient.post<ParserPreview>(
      `/media/${mediaId}/parser-config/preview`,
      config,
    );
    return response.data;
  },
};
