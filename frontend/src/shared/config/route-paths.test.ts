import { describe, expect, it } from 'vitest';

import { createNewsPath } from './route-paths';

describe('createNewsPath', () => {
  it('creates an absolute path for a media source', () => {
    expect(createNewsPath(42)).toBe('/media/42/news');
  });
});
