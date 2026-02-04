import React from 'react'
import { useColorSchemeStore } from '~/zustand/colorSchemeStore'
type inputBoxProps = {
    icon: React.FC<React.SVGProps<SVGSVGElement>>,
    value: string,
    index: number,
    label: string,
    iconCss: string,
    setter: (value: string) => void
}
export default function InputText({ index, icon: Icon, value, label, iconCss, setter }: inputBoxProps) {
    const colorScheme = useColorSchemeStore(state => state.colorScheme);

    return (
        <label htmlFor={`#${label}${index}`} className='group bg-bg-200 h-15 px-4 py-2.5 w-full flex items-center justify-between rounded-[10px]'>
            <div className='flex gap-2 items-center justify-between w-full'>
                <Icon className={iconCss + (colorScheme === 'dark' ? 'text-amber-200' : 'text-violet-500')} />
                <div className='flex-1'>
                    <input id={`#${label}${index}`} type="text" className='text-text-100 text-right text-clr-200 w-full outline-none' value={value} onChange={(e) => setter(e.target.value)} />
                    <p className=" ml-auto w-full max-w-[18vw] [@media(min-width:386px)]:max-w-full truncate text-right font-light capitalize text-clr-200 text-text-300 group-focus-within:max-w-full group-focus-within:whitespace-normal group-focus-within:overflow-visible">{label}</p>
                </div>
            </div>
        </label>
    )
}
