import React from 'react'

export default function HeadingMedium({ text, css }:{ text: string, css: string } ) {
  return <h2 className={'text-heading-200 capitalize font-medium text-clr-100 max-w-[80vw]  ' + css}>{text}</h2>
}
