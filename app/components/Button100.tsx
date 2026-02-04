import React from 'react'

type ButtonType = {
    text: string,
    css: string,
    callback: () => void
}
export default function Button100({text, css, callback}:ButtonType) {
  return (
    <button className={` text-center w-full h-10 flex justify-center items-center rounded-md text-text-100 ${css}`} onClick={() => callback()}>{text}</button>
  )
}
