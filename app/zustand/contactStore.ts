/**
 * Zustand store to manage contacts and Lunr search index
 */

import { create } from "zustand";
import type { Contact } from "~/types/contact";
import type lunr from "lunr";

/* ----------------------------- Store Type ------------------------------ */

type ContactStore = {
  allContacts: Contact[];         // All contacts in memory
  contactLoadStatus: string;      // Status of loading contacts (e.g., 'loading', 'success', 'error')
  index: lunr.Index | null;       // Lunr search index for contacts

  // Actions
  setIndex: (index: lunr.Index) => void;
  setAllContacts: (contacts: Contact[]) => void;
  addContact: (newContact: Contact) => void;
  removeContact: (id: string) => void;
  setContactLoadStatus: (status: string) => void;
};

/* ----------------------------- Store ---------------------------------- */

export const useContactStore = create<ContactStore>((set) => ({
  /* -------------------------- Initial State --------------------------- */

  allContacts: [],
  contactLoadStatus: "",
  index: null,

  /* ---------------------------- Actions ------------------------------- */

  /**
   * Replace all contacts
   */
  setAllContacts: (contacts) => set(() => ({ allContacts: contacts })),

  /**
   * Update loading status
   */
  setContactLoadStatus: (status) => set(() => ({ contactLoadStatus: status })),

  /**
   * Set Lunr index for search
   */
  setIndex: (index) => set(() => ({ index })),

  /**
   * Add a new contact to the store
   */
  addContact: (newContact) =>
    set((state) => ({
      allContacts: [...state.allContacts, newContact],
    })),

  /**
   * Remove a contact by ID
   */
  removeContact: (id) =>
    set((state) => ({
      allContacts: state.allContacts.filter((c) => c._id !== id),
    })),
}));
