import { useEffect, useState } from 'react';
import { Contacts, HeadingMedium } from '~/components'
import { useContactStore } from '~/zustand/contactStore'
import { useInputTextStore } from '~/zustand/store'
import { createContactIndex, searchQuery } from '~/lunr/lunrFunctions';

export default function Search() {
  const allContacts = useContactStore(state => state.allContacts);
  const inputText = useInputTextStore(state => state.inputText);
  const [searchedContacts, setSearchedContacts] = useState(allContacts);

  useEffect(() => {
    function handleSearch() {
      const index = createContactIndex(allContacts);
      const filteredContacts = searchQuery(inputText, index, allContacts);
      console.log(index)
      setSearchedContacts(filteredContacts);
    }

    handleSearch();
  }, [inputText])
  return (
    <main className='flex flex-col gap-4 px-8 pt-11 h-[calc(100vh-120px)]'>
      <HeadingMedium text={(inputText || 'Search') + '...'} css='' />
      <Contacts contacts={searchedContacts} />
    </main>
  )
}
