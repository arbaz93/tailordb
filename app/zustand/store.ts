import { create } from 'zustand';

type InputStore = {
    inputText: string;
    setInputText: (text: string) => void;
  };
  
  export const useInputTextStore = create<InputStore>((set) => ({
    inputText: '',
  
    setInputText: (text) =>
      set(() => ({
        inputText: text,
      })),
  }));
  