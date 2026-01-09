import ContactBox from './ContactBox'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useContactStore } from '~/zustand/contactStore'
import { type Contact } from '~/types/contact'
import PhantomContactBox from './PhantomContactBox'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
type ContactsProps = {
  contacts: Contact[]
}

export default function Contacts({ contacts }: ContactsProps) {
  const contactLoadStatus = useContactStore(state => state.contactLoadStatus)
  const location = useLocation();


//   return (
//     <div className='flex flex-col gap-4'>
//       {contacts.map((contact:Contact, i:number) => <ContactBox contact={contact} key={i} index={i}/>)}
//     </div>
//   )

// reference to the scrollable container
  const parentRef = useRef<HTMLDivElement>(null)
  const parentElement = useRef<HTMLDivElement>(null);
  


const virtualizer = useVirtualizer({
  //total items
  count: contacts.length,
  // get scroll element
  getScrollElement: () => parentRef.current,
  //height of each item
  estimateSize: () => 96,
  // render a few items for smooth scroll
  overscan: 5

})

if (contactLoadStatus === 'loading') {
  return <PhantomContactBox numberOfPhantomBoxes={10} />
}

const virtualItems = virtualizer.getVirtualItems();

const parentHeight = parentElement.current
? parentElement.current && getComputedStyle(parentElement.current).height
: '550px';

return (
  <div className='flex-1' ref={parentElement}>
    <div
    ref={parentRef}
    style={{
      height: parentHeight,
      overflow: 'auto',
      width: '100%'
    }}
  >
    <div
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        position: 'relative',
        width: '100%',
      }}
    >
      {virtualItems.map(item => (
        <div
          key={item.key}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${item.size}px`,
            transform: `translateY(${item.start}px)`,
          }}
        >
          <ContactBox
            contact={contacts[item.index]}
            index={item.index}
          />
        </div>
      ))}
    </div>
  </div>
  </div>
)
}
