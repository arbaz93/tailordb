import { create } from 'zustand';
import type { Contact } from '~/types/contact';
import type lunr from 'lunr';

type ContactStore = {
  allContacts: Contact[];
  contactLoadStatus: string;
  index: lunr.Index | null;
  setIndex: (index: lunr.Index) => void;
  setAllContacts: (contacts: Contact[]) => void;
  setContactLoadStatus: (status: string) => void;
};

export const useContactStore = create<ContactStore>((set) => ({
  allContacts: [],
  contactLoadStatus: '',
  index: null,

  setAllContacts: (contacts) =>
    set(() => ({
      allContacts: contacts,
    })),
    setContactLoadStatus: (status) =>
      set(() => ({
        contactLoadStatus: status,
      })),
  setIndex: (index) =>
    set({
      index,
    }),
}));
