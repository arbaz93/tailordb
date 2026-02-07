import React from 'react'
import { useColorSchemeStore } from '~/zustand/colorSchemeStore'

type inputBoxProps = {
    icon: React.FC<React.SVGProps<SVGSVGElement>>,
    value: string,
    label: string,
    name: string,
    addStroke: boolean | null | undefined,
    checked: boolean | undefined,
    index: number,
    iconCss: string,
    setter: (value: string) => void
}
export default function InputText({ index, icon: Icon, addStroke, value, label, name, checked, iconCss, setter }: inputBoxProps) {
    const colorScheme = useColorSchemeStore(state => state.colorScheme)
    return (
        <label htmlFor={`#${label}${index}`} className='bg-bg-200 h-15 px-4 py-2.5 w-full  flex items-center justify-between rounded-[10px]'>
            <div className='flex gap-2 items-center justify-between w-full'>
                <Icon className={iconCss + (colorScheme === 'dark' ? 'text-clr-200' : 'text-clr-200') } style={{stroke: (addStroke ? (colorScheme === 'dark' ? 'hsl(0 0% 25%) ' : 'hsl(0 0% 95%)') : '')}} />
                <div className='flex flex-col gap-2 items-end *:w-min'>
                    <input id={`#${label}${index}`} type="radio" name={name} className='text-right text-text-100 text-clr-200 outline-none' checked={checked} value={value} onChange={(e) => setter(e.target.value)} />
                    <p className='text-text-300 text-clr-200 font-light text-right capitalize'>{label}</p>
                </div>
            </div>
        </label>
    )
}
