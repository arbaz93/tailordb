import React from "react";
import { useColorSchemeStore } from "~/zustand/colorSchemeStore";

/* ----------------------------- Props ---------------------------------- */
type InputTextProps = {
  /** Icon component displayed on the left */
  icon: React.FC<React.SVGProps<SVGSVGElement>>;

  /** The current input value */
  value: string;

  /** Label text displayed below the input */
  label: string;

  /** Name attribute for the radio input */
  name: string;

  /** Whether to add a stroke to the icon */
  addStroke?: boolean | null;

  /** Checked state for the radio button */
  checked?: boolean;

  /** Index used for unique IDs */
  index: number;

  /** Additional classes for the icon */
  iconCss: string;

  /** Setter callback when the input changes */
  setter: (value: string) => void;
};

/* -------------------------- Component --------------------------------- */
export default function InputText({
  index,
  icon: Icon,
  addStroke = false,
  value,
  label,
  name,
  checked = false,
  iconCss,
  setter,
}: InputTextProps) {
  const colorScheme = useColorSchemeStore((state) => state.colorScheme);

  // Safe ID for HTML element
  const inputId = `input-${label}-${index}`;

  // Compute icon stroke color
  const strokeColor = addStroke
    ? colorScheme === "dark"
      ? "hsl(0 0% 25%)"
      : "hsl(0 0% 95%)"
    : undefined;

  return (
    <label
      htmlFor={inputId}
      className="bg-bg-200 h-15 px-4 py-2.5 w-full flex items-center justify-between rounded-[10px]"
    >
      <div className="flex gap-2 items-center justify-between w-full">
        {/* Left: Icon */}
        <Icon className={`${iconCss} text-clr-200`} style={{ stroke: strokeColor }} />

        {/* Right: Radio input + label */}
        <div className="flex flex-col gap-2 items-end min-w-[max-content]">
          <input
            id={inputId}
            type="radio"
            name={name}
            value={value}
            checked={checked}
            className="text-right text-text-100 text-clr-200 outline-none"
            onChange={(e) => setter(e.target.value)}
          />
          <p className="text-text-300 text-clr-200 font-light text-right capitalize">
            {label}
          </p>
        </div>
      </div>
    </label>
  );
}
