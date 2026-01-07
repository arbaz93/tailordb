import React from 'react'
import logo from '../assets/logo-white-black.svg'
import logoBlack from '../assets/logo black.svg'
import { useColorSchemeStore } from '~/zustand/colorSchemeStore'
export default function SplashScreen({ display, pulse} : { display: boolean, pulse: boolean}) {
const colorScheme = useColorSchemeStore(state => state.colorScheme)
  return (
    <div className={`bg-splash-screen absolute inset-0 items-center flex-col ` + (display ? 'flex' : 'hidden')}>
      <img src={colorScheme === 'dark' ? logo : logoBlack} alt="logo" className={'w-67.5 mt-[27.73dvh] [animation-duration:3s] ' + (pulse && 'animate-pulse')}/>
      <h1 className={'text-small-initial ff-montserrat ml-2 text-clr-200/80 [animation-duration:3s] ' + (pulse && 'animate-pulse')}><span className='text-big-initial  font-bold text-primary tracking-tight'>AR</span><span className='tracking-tighter'>TAILORS</span></h1>
    </div>
  )
}
