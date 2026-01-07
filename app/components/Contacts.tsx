import ContactBox from './ContactBox'

import { type Contact } from '~/types/contact';

type ContactsProps = {
  contacts: Contact[]; // props contains an array of Contact
};

export default function Contacts({ contacts }:ContactsProps) {
  return (
    <div className='flex flex-col gap-4'>
      {contacts.map((contact:Contact, i:number) => <ContactBox contact={contact} key={i} index={i}/>)}
    </div>
  )
}
