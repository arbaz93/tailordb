import { create } from 'zustand';
import type lunr from 'lunr';

type IndexStore = {
  index: lunr.Index | null;
  setIndex: (index: lunr.Index) => void;
};

export const useLunrIndexStore = create<IndexStore>((set) => ({
  index: null,

  setIndex: (index) =>
    set({
      index,
    }),
}));
