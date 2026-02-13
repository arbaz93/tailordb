import React from "react";

/* ----------------------------- Props ---------------------------------- */
type CircleProps = {
  /** Text from which the initial is taken */
  text: string;

  /** Optional index for deterministic background color */
  index?: number;

  /** Additional CSS classes */
  css?: string;
};

/* -------------------------- Component -------------------------------- */
export default function CircleWithInitial({ text, index, css = "" }: CircleProps) {
  /**
   * Determines the background color based on index
   * Falls back to gray if no index is provided
   */
  const bgColor = (): string => {
    const colors = [
      "bg-violet-800",
      "bg-indigo-800",
      "bg-blue-800",
      "bg-cyan-800",
      "bg-emerald-800",
      "bg-orange-800",
      "bg-rose-800",
    ];

    return index === undefined ? "bg-gray-100" : colors[index % colors.length];
  };

  return (
    <div
      className={`
        w-[2.4em] 
        aspect-square 
        rounded-full 
        flex 
        justify-center 
        items-center 
        text-white 
        capitalize 
        font-semibold 
        ${bgColor()} 
        ${css}
      `}
    >
      {text[0]}
    </div>
  );
}
