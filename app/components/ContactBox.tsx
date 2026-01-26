import { Link } from 'react-router';
import CircleWithInitial from './CircleWithInitial';
import { ArrowLeftV3Icon, ScissorIcon, PhoneFilledIcon } from '~/icons/miscIcons';
import { base64Encode } from '~/utils/scripting';

type Contact = {
  _id: string,
  name: string,
  phone: string,
  code: string,
  updatedAt: string,
}
type ContactBoxProps = {
  contact: Contact;
  index: number
};

export default function ContactBox({ contact, index }: ContactBoxProps) {

  return (
    <div className='flex justify-between items-center h-18 max-w-full bg-bg-200 rounded-lg pl-2 pr-4 overflow-hidden'>
      <div className='flex gap-2'>
        <div className='w-15 my-1.5'>
          <CircleWithInitial text={contact.name} index={index} css='text-heading-100' />
        </div>
        <div className='flex flex-col justify-center'>
          <div>
            <p className='capitalize text-text-100 text-clr-200 font-medium whitespace-nowrap max-w-[18ch] overflow-hidden text-ellipsis'>{contact.name}</p>
          </div>
          <div className='flex gap-2 max-w-full overflow-hidden'>
            <div className='flex gap-0.5'>
              <ScissorIcon className='w-4 fill-clr-200' />
              <p className='text-text-200 text-clr-200 font-medium whitespace-nowrap max-w-[5ch] overflow-hidden text-ellipsis'>{contact.code}</p>
            </div>
            <div className='flex gap-0.5'>
              <PhoneFilledIcon className='w-4 fill-clr-200' />
              <p className='text-text-200 text-clr-200 font-medium whitespace-nowrap max-w-[11ch] overflow-hidden text-ellipsis'> {contact.phone}</p>
            </div>
          </div>
        </div>
      </div>
      <Link to={`/contact/${base64Encode(JSON.stringify({id: contact._id, name: contact.name, phone: contact.phone, code: contact.code, index: index}))}`} className='flex h-full justify-center items-center'>
        <ArrowLeftV3Icon className='w-2 fill-clr-200' />
      </Link>
    </div>
  )
}
