import React from 'react'
import { EditIcon } from '~/icons/miscIcons'

type inputBoxProps = {
    icon: React.FC<React.SVGProps<SVGSVGElement>>,
    text: string,
    label: string,
    iconCss: string,
    setter: (value: string) => void
}
export default function InputBoxType100({ icon: Icon, text, label, iconCss, setter }: inputBoxProps) {
    return (
        <label htmlFor={`#${label}`} className='bg-bg-200 px-4 py-2.5 w-full flex items-center justify-between rounded-[10px]'>
            <div className='flex gap-2 items-center max-w-[90%]'>
                <Icon className={iconCss} />
                <div className='flex-1'>
                    <input id={`#${label}`} className='text-text-100 text-clr-200 w-full outline-none' value={text} onChange={(e) => setter(e.target.value)} />
                    <p className='text-text-300 text-clr-200 font-light w-full'>{label}</p>
                </div>
            </div>
            <EditIcon className='fill-clr-200 w-5'/>
        </label>
    )
}
