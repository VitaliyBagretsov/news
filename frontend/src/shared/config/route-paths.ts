export const routePaths = {
  media: '/',
  news: '/news/:mediaId',
} as const;

export const createNewsPath = (mediaId: number): string => `/news/${mediaId}`;
