import React from "react";

/* ----------------------------- Props ---------------------------------- */
type InputNoteProps = {
  /** Current input value */
  value: string;

  /** Setter callback for updating the value */
  setter: (value: string) => void;
};

/* -------------------------- Component --------------------------------- */
export default function InputNote({ value, setter }: InputNoteProps) {
  const inputId = "note"; // Safe ID (removed #)

  return (
    <label
      htmlFor={inputId}
      className="bg-bg-200 min-h-19.5 px-4 py-2.5 w-full sm:w-full rounded-[10px] gray-box gray-box-text"
    >
      {/* Label */}
      <p className="text-text-300 text-clr-200 font-light">Note</p>

      {/* Text input */}
      <input
        id={inputId}
        type="text"
        className="text-text-100 text-clr-200 w-full outline-none"
        value={value}
        onChange={(e) => setter(e.target.value)}
      />
    </label>
  );
}
