import React from "react";
import { useColorSchemeStore } from "~/zustand/colorSchemeStore";

/* ----------------------------- Props ---------------------------------- */
type InputCheckBoxProps = {
  /** Icon component to display next to the checkbox */
  icon: React.FC<React.SVGProps<SVGSVGElement>>;

  /** Label text displayed next to the checkbox */
  label: string;

  /** Name attribute for the checkbox */
  name: string;

  /** Index used to create unique IDs */
  index: number;

  /** Whether to add a stroke to the icon */
  addStroke?: boolean | null;

  /** Checkbox checked state */
  checked: boolean;

  /** Additional classes for the icon */
  iconCss: string;

  /** Setter callback for checkbox value */
  setter: (value: boolean) => void;
};

/* -------------------------- Component --------------------------------- */
export default function InputCheckBox({
  index,
  icon: Icon,
  addStroke = false,
  label,
  name,
  checked,
  iconCss,
  setter,
}: InputCheckBoxProps) {
  const colorScheme = useColorSchemeStore((state) => state.colorScheme);

  // Compute dynamic stroke color for the icon
  const strokeColor = addStroke
    ? colorScheme === "dark"
      ? "hsl(0 0% 25%)"
      : "hsl(0 0% 95%)"
    : undefined;

  // Generate a safe ID (removed #)
  const inputId = `checkbox-${label}-${index}`;

  return (
    <label
      htmlFor={inputId}
      className="bg-bg-200 h-15 px-4 py-2.5 w-full flex items-center justify-between rounded-[10px] gray-box"
    >
      <div className="flex gap-2 items-center justify-between w-full">
        {/* Left icon */}
        <Icon
          className={`${iconCss} text-clr-200`}
          style={{ stroke: strokeColor }}
        />

        {/* Right: checkbox + label */}
        <div className="flex flex-col gap-2 items-end min-w-[max-content]">
          <input
            id={inputId}
            type="checkbox"
            name={name}
            checked={checked}
            className="text-text-100 text-clr-200 w-full outline-none"
            onChange={(e) => setter(e.target.checked)}
          />
          <p className="text-text-300 text-clr-200 font-light capitalize whitespace-nowrap max-w-[11ch] overflow-hidden text-ellipsis">
            {label}
          </p>
        </div>
      </div>
    </label>
  );
}
