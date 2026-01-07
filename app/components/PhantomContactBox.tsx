import CircleWithInitial from './CircleWithInitial';
import { ArrowLeftV3Icon, ScissorIcon, PhoneFilledIcon } from '~/icons/miscIcons';

export default function PhantomContactBox({ numberOfPhantomBoxes }: { numberOfPhantomBoxes: number }) {
  console.log(Array.from({ length: numberOfPhantomBoxes }))
  return   <>
  {Array.from({ length: numberOfPhantomBoxes }).map(() => (
    <div className='animate-pulse flex justify-between items-center max-w-full bg-bg-200 rounded-lg px-4 overflow-hidden'>
      <div className='flex gap-2'>
        <div className='w-15 my-1.5'>
          <CircleWithInitial text={''} index={undefined} css={'bg-bg-200'} />
        </div>
      </div>
    </div>
  ))}
</>
}
