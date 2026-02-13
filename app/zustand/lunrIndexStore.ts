/**
 * Zustand store for managing a Lunr search index
 * Allows storing and updating the index globally
 */

import { create } from "zustand";
import type lunr from "lunr";

/* ----------------------------- Store Type ------------------------------ */

type IndexStore = {
  /** Lunr search index, null if not yet created */
  index: lunr.Index | null;

  /** Set or replace the Lunr index */
  setIndex: (index: lunr.Index) => void;
};

/* ----------------------------- Store ---------------------------------- */

export const useLunrIndexStore = create<IndexStore>((set) => ({
  /** Initial state: no index */
  index: null,

  /** Action to set or replace the Lunr index */
  setIndex: (index) => set(() => ({ index })),
}));
