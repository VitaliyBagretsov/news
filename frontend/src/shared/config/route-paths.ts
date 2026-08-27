export const routePaths = {
  home: '/',
  login: '/login',
  media: '/media',
  news: '/news/:mediaId',
} as const;

export const createNewsPath = (mediaId: number): string => `/news/${mediaId}`;
