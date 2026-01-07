import { create } from 'zustand';

type ColorScheme = 'light' | 'dark';

type ColorSchemeState = {
  colorScheme: ColorScheme;
  setColorScheme: (newColor?: ColorScheme) => void;
  hydrate: () => void;
};

export const useColorSchemeStore = create<ColorSchemeState>((set, get) => ({
  colorScheme: 'dark', // default for SSR

  hydrate: () => {
    if (typeof window === 'undefined') return;

    const stored =
      (localStorage.getItem('ArColorScheme') as ColorScheme) || 'dark';

    set({ colorScheme: stored });
  },

  setColorScheme: (newColor) => {
    const next =
      newColor ?? (get().colorScheme === 'dark' ? 'light' : 'dark');

    set({ colorScheme: next });

    if (typeof window !== 'undefined') {
      localStorage.setItem('ArColorScheme', next);
    }
  },
}));
