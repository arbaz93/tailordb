import { useEffect, useState } from "react";

interface RoundButtonProps {
  text: string;
  css?: string;
  active: boolean;
  changeActive: (text: string) => void;
  callback?: (text: string) => void;
}

export default function RoundButton({
  text,
  css = "",
  active,
  changeActive,
  callback,
}: RoundButtonProps) {
  const [isActive, setIsActive] = useState(active);

  function handleClick() {
    changeActive(text);
    callback?.(text);
  }

  // Sync local state with parent active prop
  useEffect(() => {
    setIsActive(active);
  }, [active]);

  return (
    <button
      className={`w-14.5 h-14.5 cursor-pointer rounded-full flex justify-center items-center border ${
        isActive
          ? "border-transparent bg-bg-100 text-clr-100"
          : "text-clr-200 border-clr-light-200"
      } ${css}`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
