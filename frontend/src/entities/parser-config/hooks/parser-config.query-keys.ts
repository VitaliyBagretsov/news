export const parserConfigQueryKeys = {
  root: ['parser-config'] as const,
  byMedia: (mediaId: number) => ['parser-config', mediaId] as const,
};
