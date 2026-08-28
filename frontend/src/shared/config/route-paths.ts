export const routePaths = {
  home: '/',
  login: '/login',
  media: '/media',
  news: '/media/:mediaId/news',
} as const;

export const createNewsPath = (mediaId: number): string => `/media/${mediaId}/news`;
