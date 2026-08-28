import { afterEach, describe, expect, it } from 'vitest';

import { useMediaStore } from './media.store';
import type { Media } from './media.types';

const media: Media = {
  id: 1,
  title: 'RT',
  description: '',
  url: 'https://russian.rt.com',
  copyright: '',
  contact: '',
  chiefEditor: '',
  address: '',
  email: '',
  phone: '',
  isActive: true,
  logo: '',
};

describe('useMediaStore', () => {
  afterEach(() => useMediaStore.setState({ media: [] }));

  it('stores media received from the server', () => {
    useMediaStore.getState().setMedia([media]);

    expect(useMediaStore.getState().media).toEqual([media]);
  });
});
