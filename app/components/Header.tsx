import type React from "react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { MoonIcon, SunIcon } from "~/icons/ColorSchemeIcons";
import { SquarePlusIcon } from "~/icons/miscIcons";
import { HomeIcon } from "~/icons/nav/NavigationIcons";
import { useColorSchemeStore } from "~/zustand/colorSchemeStore";
import { useInputTextStore } from "~/zustand/store";

/* ----------------------------- Props ---------------------------------- */
type HeaderProps = {
  /** Header title text */
  text: string;

  /** Icon component (SVG) displayed on left */
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
};

/* -------------------------- Component --------------------------------- */
export default function Header({ text, icon: Icon = HomeIcon }: HeaderProps) {
  const { pathname } = useLocation();

  // Color scheme state (light / dark)
  const colorScheme = useColorSchemeStore((state) => state.colorScheme);
  const setColorScheme = useColorSchemeStore((state) => state.setColorScheme);

  // Search input state
  const inputText = useInputTextStore((state) => state.inputText);
  const setInputText = useInputTextStore((state) => state.setInputText);

  // Determine if current route is /search
  const isSearchRoute = pathname === "/search";

  /* ------------------- Sync input with route -------------------------- */
  useEffect(() => {
    // Clear input on search route, otherwise use header text
    setInputText(isSearchRoute ? "" : text);
  }, [isSearchRoute, text, setInputText]);

  return (
    <header className="sticky top-0 flex h-15 w-full items-center justify-between gap-4 bg-background px-8">
      {/* Left: icon + input */}
      <div className="flex items-center gap-4">
        <Icon className="w-6 fill-clr-100" />
        <input
          className={`w-full max-w-full font-semibold text-text-200 outline-none ${
            !isSearchRoute ? "placeholder-clr-100" : ""
          }`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={text}
          disabled={!isSearchRoute}
        />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-4">
        {/* Add new contact */}
        <Link to="/contact">
          <SquarePlusIcon className="w-6 fill-clr-100" />
        </Link>

        {/* Toggle light/dark mode */}
        <button
          type="button"
          onClick={() => setColorScheme(undefined)}
          className="cursor-pointer transition-opacity hover:opacity-80"
        >
          {colorScheme === "light" ? (
            <SunIcon className="w-6 fill-clr-100" />
          ) : (
            <MoonIcon className="w-6 fill-clr-100" />
          )}
        </button>
      </div>
    </header>
  );
}
