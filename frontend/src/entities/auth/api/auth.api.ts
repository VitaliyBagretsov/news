import { apiClient } from '@/shared/api';

import type { AnonymousSession, AuthenticatedSession, LoginCredentials } from '../model';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthenticatedSession> => {
    const response = await apiClient.post<AuthenticatedSession>('/auth/login', credentials);

    return response.data;
  },

  getSession: async (signal?: AbortSignal): Promise<AuthenticatedSession> => {
    const response = await apiClient.get<AuthenticatedSession>('/auth/session', { signal });

    return response.data;
  },

  logout: async (): Promise<AnonymousSession> => {
    const response = await apiClient.post<AnonymousSession>('/auth/logout');

    return response.data;
  },
};
