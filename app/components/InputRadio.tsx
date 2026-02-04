import React from 'react'

type inputBoxProps = {
    icon: React.FC<React.SVGProps<SVGSVGElement>>,
    value: string,
    label: string,
    name: string,
    checked: boolean | undefined
    index: number,
    iconCss: string,
    setter: (value: string) => void
}
export default function InputText({ index, icon: Icon, value, label, name, checked, iconCss, setter }: inputBoxProps) {
    return (
        <label htmlFor={`#${label}${index}`} className='bg-bg-200 h-15 px-4 py-2.5 w-full  flex items-center justify-between rounded-[10px]'>
            <div className='flex gap-2 items-center justify-between w-full'>
                <Icon className={iconCss} />
                <div className='flex flex-col gap-2 items-end *:w-min'>
                    <input id={`#${label}${index}`} type="radio" name={name} className='text-right text-text-100 text-clr-200 outline-none' checked={checked} value={value} onChange={(e) => setter(e.target.value)} />
                    <p className='text-text-300 text-clr-200 font-light text-right capitalize'>{label}</p>
                </div>
            </div>
        </label>
    )
}
