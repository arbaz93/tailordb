type inputBoxProps = {
    value: string,
    setter: (value: string) => void
}
export default function InputNote({value, setter }: inputBoxProps) {
  return (
    <label htmlFor={`#note`} className='bg-bg-200 min-h-19.5 px-4 py-2.5 w-full sm:w-full rounded-[10px]'>
            <p className='text-text-300 text-clr-200 font-light '>Note</p>
            <input id={`#note`} type="text" className='text-text-100 text-clr-200 w-full outline-none' value={value} onChange={(e) => setter(e.target.value)} />
    </label>
  )
}
