import React from 'react';
import { useColorSchemeStore } from '~/zustand/colorSchemeStore';

/* ----------------------------- Props ---------------------------------- */
type InputTextProps = {
  /** Icon component displayed on the left */
  icon: React.FC<React.SVGProps<SVGSVGElement>>;

  /** Current input value */
  value: string;

  /** Index used to generate a unique input ID */
  index: number;

  /** Label text displayed below the input */
  label: string;

  /** Whether to add a stroke to the icon */
  addStroke?: boolean | null;

  /** Additional CSS classes for the icon */
  iconCss?: string;

  /** Setter function called when input changes */
  setter: (value: string) => void;
};

/* -------------------------- Component --------------------------------- */
export default function InputText({
  index,
  icon: Icon,
  value,
  addStroke = false,
  label,
  iconCss = '',
  setter,
}: InputTextProps) {
  const colorScheme = useColorSchemeStore((state) => state.colorScheme);

  // Generate safe ID (removed `#`, not valid in `id` or `htmlFor`)
  const inputId = `input-${label}-${index}`;

  // Determine icon stroke color based on props and theme
  const strokeColor = addStroke
    ? colorScheme === 'dark'
      ? 'hsl(0 0% 25%)'
      : 'hsl(0 0% 95%)'
    : undefined;

  return (
    <label
      htmlFor={inputId}
      className="group bg-bg-200 h-15 px-4 py-2.5 w-full flex items-center justify-between rounded-[10px] gray-box"
    >
      <div className="flex gap-2 items-center justify-between w-full">
        {/* Icon on the left */}
        <Icon
          className={`${iconCss} text-clr-200`}
          style={{ stroke: strokeColor }}
        />

        {/* Input + Label */}
        <div className="flex-1">
          <input
            id={inputId}
            type="text"
            className="text-text-100 text-right text-clr-200 w-full outline-none"
            value={value}
            onChange={(e) => setter(e.target.value)}
          />
          <p
            className="ml-auto w-full max-w-[18vw] 
                       [@media(min-width:386px)]:max-w-full 
                       truncate text-right font-light capitalize 
                       text-clr-200 text-text-300 
                       group-focus-within:max-w-full 
                       group-focus-within:whitespace-normal 
                       group-focus-within:overflow-visible"
          >
            {label}
          </p>
        </div>
      </div>
    </label>
  );
}
