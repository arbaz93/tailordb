import React from "react";
import { EditIcon } from "~/icons/miscIcons";

/* ----------------------------- Props ---------------------------------- */
type InputBoxProps = {
  /** Icon to display on the left */
  icon: React.FC<React.SVGProps<SVGSVGElement>>;

  /** Current input value */
  text: string;

  /** Label text displayed below the input */
  label: string;

  /** Tailwind classes for the icon */
  iconCss: string;

  /** Whether input is required */
  required?: boolean;

  /** Setter function to update input value */
  setter: (value: string) => void;
};

/* -------------------------- Component --------------------------------- */
export default function InputBoxType100({
  icon: Icon,
  text,
  label,
  iconCss,
  required = false,
  setter,
}: InputBoxProps) {
  return (
    <label
      htmlFor={`input-${label}`} // safer ID (removed #)
      className="bg-bg-200 px-4 py-2.5 w-full flex items-center justify-between rounded-[10px]"
    >
      {/* Left section: Icon + Input */}
      <div className="flex gap-2 items-center max-w-[90%]">
        <Icon className={iconCss} />
        <div className="flex-1">
          <input
            id={`input-${label}`}
            className="text-text-100 text-clr-200 w-full outline-none"
            required={required}
            value={text}
            onChange={(e) => setter(e.target.value)}
          />
          <p className="text-text-300 text-clr-200 font-light w-full">{label}</p>
        </div>
      </div>

      {/* Right section: Edit icon */}
      <EditIcon className="fill-clr-200 w-5" />
    </label>
  );
}
