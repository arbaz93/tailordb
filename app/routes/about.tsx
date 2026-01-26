import React from 'react'
import { useColorSchemeStore } from '~/zustand/colorSchemeStore'
import logoBlack from '../assets/logo black.svg'
import logoWhite from '../assets/logo-white-black.svg'
import { UserIcon } from '~/icons/nav/NavigationIcons'
import { PhoneFilledIcon, ClockIcon, PinFilledIcon, CodeIcon } from '~/icons/miscIcons'
import { aboutUs } from '~/utils/aboutus'

export default function About() {
  const colorScheme = useColorSchemeStore(state => state.colorScheme);

  const logo = (colorScheme === 'dark') ? logoWhite : logoBlack;
  return (  // h=[100vh-footerHeight+headerHeight]
    <main className='flex flex-col justify-between items-center h-[calc(100dvh-48px-60px)] px-8 pt-15 pb-5 text-text-100 font-medium text-clr-100'>
      <section className='grid gap-8'>
        <div className='w-full p-6 bg-bg-100 overflow-hidden rounded-lg'>
          <img className={'w-32 m-auto'} src={logo} />
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex gap-4 items-center'>
            <UserIcon className='w-4.5 fill-clr-100' />
            <p className='flex-1'>{aboutUs.name}</p>
          </div>
          <div className='flex gap-4 items-center'>
            <PinFilledIcon className='w-4 fill-clr-100' />
            <p className='flex-1'>{aboutUs.location}</p>
          </div>
          <div className='flex gap-4 items-center'>
            <PhoneFilledIcon className='w-5 fill-clr-100' />
            <p className='flex-1'>{aboutUs.phone}</p>
          </div>
          <div className='flex gap-4 items-center'>
            <ClockIcon className='w-5 fill-clr-100' />
            <p className='flex-1'>{aboutUs.timing}</p>
          </div>
        </div>
      </section>
      <section className='flex gap-4 w-full justify-center'>
        <CodeIcon className='w-4.5 fill-clr-100' />
        <p className='flex-1 text-text-200'>Designed&Developed by <a href='mailto:yousafarbaz.dev@gmail.com' target='_blank' className='text-primary'>Yousaf Arbaz</a></p>
      </section>
    </main>
  )
}
