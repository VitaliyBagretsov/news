import { describe, expect, it } from 'vitest';

import { convertTZ } from './parse.util';

describe('convertTZ', () => {
  it('returns the date represented in the requested time zone', () => {
    const result = convertTZ('2024-01-15T12:30:00.000Z', 'UTC');

    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(15);
    expect(result.getHours()).toBe(12);
    expect(result.getMinutes()).toBe(30);
  });
});
