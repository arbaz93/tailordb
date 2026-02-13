/**
 * Search Page
 * Filters contacts based on inputText using a Lunr index.
 */

import { useEffect, useState } from "react";
import { Contacts, HeadingMedium } from "~/components";
import { useContactStore } from "~/zustand/contactStore";
import { useInputTextStore } from "~/zustand/store";
import { createContactIndex, searchQuery } from "~/lunr/lunrFunctions";

export default function Search() {
  /* --------------------------- Store & State ---------------------------- */

  const allContacts = useContactStore((state) => state.allContacts);
  const inputText = useInputTextStore((state) => state.inputText);

  // Local state for filtered contacts
  const [searchedContacts, setSearchedContacts] = useState(allContacts);

  /* --------------------------- Search Effect ---------------------------- */

  useEffect(() => {
    /**
     * Runs every time the inputText changes.
     * Builds a Lunr index from all contacts and filters results.
     */
    function handleSearch() {
      const index = createContactIndex(allContacts);
      const filteredContacts = searchQuery(inputText, index, allContacts);
      setSearchedContacts(filteredContacts);
    }

    handleSearch();
  }, [inputText, allContacts]); // added allContacts to dependency to be safe

  /* ----------------------- Sync with allContacts ------------------------ */

  useEffect(() => {
    setSearchedContacts(allContacts);
  }, [allContacts]);

  /* ------------------------------ Render -------------------------------- */

  return (
    <main
      className={`flex flex-col gap-1.25 px-8 pt-11 ${
        !allContacts.length ? "h-auto" : "h-[calc(100vh-120px)]"
      }`}
    >
      {/* Dynamic heading */}
      <HeadingMedium
        text={`${inputText || "Search"}...`}
        css="mb-[11px]"
      />

      {/* Search results */}
      <Contacts contacts={searchedContacts} />
    </main>
  );
}
