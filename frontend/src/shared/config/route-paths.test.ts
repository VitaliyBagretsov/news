import { describe, expect, it } from 'vitest';

import { createNewsPath, createParserConfigPath } from './route-paths';

describe('createNewsPath', () => {
  it('creates an absolute path for a media source', () => {
    expect(createNewsPath(42)).toBe('/media/42/news');
  });

  it('creates an absolute parser configuration path', () => {
    expect(createParserConfigPath(42)).toBe('/media/42/parser-config');
  });
});
