export const routePaths = {
  home: '/',
  login: '/login',
  media: '/media',
  news: '/media/:mediaId/news',
  parserConfig: '/media/:mediaId/parser-config',
} as const;

export const createNewsPath = (mediaId: number): string => `/media/${mediaId}/news`;

export const createParserConfigPath = (mediaId: number): string =>
  `/media/${mediaId}/parser-config`;
