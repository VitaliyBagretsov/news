import { create } from 'zustand';

import type { Media } from './media.types';

interface MediaState {
  media: Media[];
  setMedia: (media: Media[]) => void;
}

export const useMediaStore = create<MediaState>((set) => ({
  media: [],
  setMedia: (media) => set({ media }),
}));
