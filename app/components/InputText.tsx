import React from 'react'

type inputBoxProps = {
    icon: React.FC<React.SVGProps<SVGSVGElement>>,
    value: string,
    index: number,
    label: string,
    iconCss: string,
    setter: (value: string) => void
}
export default function InputText({ index, icon: Icon, value, label, iconCss, setter }: inputBoxProps) {
    console.log(label, value)
    return (
        <label htmlFor={`#${label}${index}`} className='bg-bg-200 h-15 px-4 py-2.5 max-w-[46%] sm:max-w-[50%] flex items-center justify-between rounded-[10px]'>
            <div className='flex gap-2 items-center justify-between w-full'>
                <Icon className={iconCss} />
                <div className='flex-1'>
                    <input id={`#${label}${index}`} type="text" className='text-text-100 text-right text-clr-200 w-full outline-none' value={value} onChange={(e) => setter(e.target.value)} />
                    <p className='text-text-300 text-clr-200 font-light w-full text-right capitalize'>{label}</p>
                </div>
            </div>
        </label>
    )
}
