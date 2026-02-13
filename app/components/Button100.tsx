import React from "react";

/* ----------------------------- Props ---------------------------------- */
type ButtonProps = {
  /** Button text */
  text: string;

  /** Additional CSS classes */
  css?: string;

  /** Callback function triggered on click */
  callback: () => void;
};

/* -------------------------- Component -------------------------------- */
export default function Button100({ text, css = "", callback }: ButtonProps) {
  return (
    <button
      className={`text-center w-full h-10 flex justify-center items-center rounded-md text-text-100 ${css}`}
      onClick={callback} // directly pass callback
    >
      {text}
    </button>
  );
}
