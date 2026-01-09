import { useEffect, useState } from "react"


interface RoundButtonProps {
  text: string,
  css: string,
  active: boolean,
  changeActive: (text:string) => void,
  callback?: (prop: any) => void;
}
export default function RoundButton({ text, css, active, changeActive, callback }:RoundButtonProps) {
  const [isActive, setIsActive] = useState<Boolean>(active);

  function handleClick() {
    changeActive(text);
      callback?.(text);

  }
  useEffect(() => {
    setIsActive(active)
  }, [changeActive])
  return (
    <button className={`w-14.5 h-14.5 cursor-pointer rounded-full text-text-200 flex justify-center items-center border ${css} ${isActive ? 'border-transparent bg-bg-100 text-clr-100 ' : ' text-clr-200 border-clr-light-200 '} `} onClick={() => handleClick()} >{text}</button>
  )
}
