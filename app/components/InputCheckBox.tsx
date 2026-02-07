import React from 'react'
import { useColorSchemeStore } from '~/zustand/colorSchemeStore';

type inputBoxProps = {
    icon: React.FC<React.SVGProps<SVGSVGElement>>,
    label: string,
    name: string,
    index: number,
    addStroke: boolean | null | undefined,
    checked: boolean,
    iconCss: string,
    setter: (value: boolean) => void
}
export default function InputCheckBox({ index, icon: Icon, addStroke, label, name, checked, iconCss, setter }: inputBoxProps) {
    const colorScheme = useColorSchemeStore(state => state.colorScheme);
    return (
        <label htmlFor={`#${label}${index}`} className='bg-bg-200 h-15 px-4 py-2.5 w-full  flex items-center justify-between rounded-[10px]'>
            <div className='flex gap-2 items-center justify-between w-full'>
                <Icon className={iconCss + (colorScheme === 'dark' ? 'text-clr-200' : 'text-clr-200')} style={{ stroke: (addStroke ? (colorScheme === 'dark' ? 'hsl(0 0% 25%) ' : 'hsl(0 0% 95%)') : '') }} />
                <div className='flex flex-col gap-2 items-end *:w-min'>
                    <input id={`#${label}${index}`} type="checkbox" name={name} checked={checked} className='text-text-100 text-clr-200 w-full outline-none' onChange={(e) => setter(e?.target?.checked)} />
                    <p className='text-text-300 text-clr-200 font-light capitalize whitespace-nowrap max-w-[11ch] overflow-hidden text-ellipsis'>{label}</p>
                </div>
            </div>
        </label>
    )
}
