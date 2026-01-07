import type React from 'react'
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { MoonIcon, SunIcon } from '~/icons/ColorSchemeIcons';
import { HomeIcon } from '~/icons/nav/NavigationIcons';
import { useColorSchemeStore } from '~/zustand/colorSchemeStore'
import { useInputTextStore } from '~/zustand/store';

type HeaderProps = {
    text: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    callback?: () => void;
  };
  
export default function Header({ text, icon: Icon, callback }: HeaderProps) {
    const location = useLocation();
    const colorScheme = useColorSchemeStore(state => state.colorScheme)
    const setColorScheme = useColorSchemeStore(state => state.setColorScheme)
    const setInputText = useInputTextStore(state => state.setInputText);
    const routeIsSearch = (location.pathname === '/search') ? true : false;

    useEffect(() => {
      setInputText(text)
      
      if(location.pathname === '/search') setInputText('')
    }, [location]);

    return (
    <header className='h-15 gap-4 w-full flex items-center justify-between px-8'>
        <div className='flex gap-4 justify-center items-center'>
                    {Icon ? <Icon className='w-6 fill-clr-100'/> : <HomeIcon />}
                    <input className={'text-clr-100 font-semibold outline-0 text-text-200 w-full max-w-full ' + (!routeIsSearch && ' placeholder-clr-100')} onChange={(e) => setInputText(e.target.value)} disabled={!routeIsSearch}  placeholder={text ?? ''} />
                  </div>
        <div onClick={() => {setColorScheme(undefined)}} className='cursor-pointer hover:opacity-80 duration-200'>
            {colorScheme === 'light' ?
              <SunIcon className='w-6 fill-clr-100' />:
              <MoonIcon className='w-6 fill-clr-100' />
            }
        </div>
    </header>
  )
}
