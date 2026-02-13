/**
 * Zustand store to manage color scheme (light / dark)
 * Supports SSR-friendly hydration and toggle
 */

import { create } from "zustand";

/* ----------------------------- Types ---------------------------------- */

/** Allowed color schemes */
type ColorScheme = "light" | "dark";

/** Store shape */
type ColorSchemeState = {
  colorScheme: ColorScheme;

  /** Set or toggle color scheme */
  setColorScheme: (newColor?: ColorScheme) => void;

  /** Hydrate state from localStorage */
  hydrate: () => void;
};

/* ----------------------------- Store ---------------------------------- */

export const useColorSchemeStore = create<ColorSchemeState>((set, get) => ({
  /** Default color scheme for SSR */
  colorScheme: "dark",

  /**
   * Hydrate color scheme from localStorage
   * Skips hydration during server-side rendering
   */
  hydrate: () => {
    if (typeof window === "undefined") return;

    const storedColor = (localStorage.getItem("ArColorScheme") as ColorScheme) || "dark";

    set({ colorScheme: storedColor });
  },

  /**
   * Set color scheme explicitly, or toggle if no argument
   * Persists choice to localStorage
   */
  setColorScheme: (newColor) => {
    const nextColor =
      newColor ?? (get().colorScheme === "dark" ? "light" : "dark");

    set({ colorScheme: nextColor });

    if (typeof window !== "undefined") {
      localStorage.setItem("ArColorScheme", nextColor);
    }
  },
}));
