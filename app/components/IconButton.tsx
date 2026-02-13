import type React from "react";

/* ----------------------------- Props ---------------------------------- */
type IconButtonCallbackArgs = {
  /** Mouse event from button click */
  event: React.MouseEvent<HTMLButtonElement>;
};

type IconButtonProps = {
  /** Icon component (SVG) to render inside the button */
  icon: React.FC<React.SVGProps<SVGSVGElement>>;

  /** Additional Tailwind classes for customization */
  css?: string;

  /** Optional callback invoked on click */
  callback?: (args: IconButtonCallbackArgs) => void;
};

/* -------------------------- Component --------------------------------- */
export default function IconButton({ icon: Icon, css = "", callback }: IconButtonProps) {
  return (
    <button
      className={`bg-primary rounded-3xl w-16.25 h-11.5 flex justify-center items-center ${css}`}
      onClick={(event) => callback?.({ event })}
    >
      <Icon className="w-6.5 fill-[#f2f2f2]" />
    </button>
  );
}
