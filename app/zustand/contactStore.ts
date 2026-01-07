import { create } from 'zustand';
import type { Contact } from '~/types/contact';
type ContactStore = {
    allContacts: Contact[];
    setAllContacts: (contacts: Contact[]) => void;
  };
  
  export const useContactStore = create<ContactStore>((set) => ({
    allContacts: [],
  
    setAllContacts: (contacts) =>
      set(() => ({
        allContacts: contacts,
      })),
  }));
  