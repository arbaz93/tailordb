import React from 'react'

type inputBoxProps = {
    icon: React.FC<React.SVGProps<SVGSVGElement>>,
    value: string,
    label: string,
    name: string,
    index: number,
    checked: boolean,
    iconCss: string,
    setter: (value: string) => void
}
export default function InputCheckBox({ index, icon: Icon, value, label, name, checked, iconCss, setter }: inputBoxProps) {
    return (
        <label htmlFor={`#${label}${index}`} className='bg-bg-200 px-4 py-2.5 w-full flex items-center justify-between rounded-[10px]'>
            <div className='flex gap-2 items-center max-w-[90%]'>
                <Icon className={iconCss} />
                <div className='flex-1'>
                    <input id={`#${label}${index}`} type="checkbox" name={name} checked={checked} className='text-text-100 text-clr-200 w-full outline-none' value={value} onChange={(e) => setter(e.target.value)} />
                    <p className='text-text-300 text-clr-200 font-light w-full capitalize'>{label}</p>
                </div>
            </div>
        </label>
    )
}
