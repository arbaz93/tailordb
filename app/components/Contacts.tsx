import ContactBox from './ContactBox'
import * as ReactWindow from 'react-window'
import { useContactStore } from '~/zustand/contactStore'
import { type Contact } from '~/types/contact'
import PhantomContactBox from './PhantomContactBox'
import { useEffect } from 'react'

type ContactsProps = {
  contacts: Contact[]
}

export default function Contacts({ contacts }: ContactsProps) {
  const contactLoadStatus = useContactStore(
    state => state.contactLoadStatus
  )

  useEffect(() => {
    console.log(contactLoadStatus)
  }, [contactLoadStatus])

  if (contactLoadStatus === 'loading') {
    return <PhantomContactBox numberOfPhantomBoxes={10} />
  }

  return (
    <div className='flex flex-col gap-4'>
      {contacts.map((contact:Contact, i:number) => <ContactBox contact={contact} key={i} index={i}/>)}
    </div>
  )
}
