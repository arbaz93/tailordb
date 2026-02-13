import { type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router";
import { navigationItems } from "~/utils/constants";

/* ----------------------------- Props ---------------------------------- */
type FooterProps = {
  /** Currently active tab (matches navigation item text) */
  activeTab: string;

  /** Setter function to update active tab */
  setActiveTab: Dispatch<SetStateAction<string>>;
};

/* -------------------------- Component --------------------------------- */
export default function Footer({ activeTab, setActiveTab }: FooterProps) {
  return (
    <footer className="flex w-full items-center justify-center bg-background h-12 fixed bottom-0 border-t border-border-clr">
      {Object.values(navigationItems).map((item) => {
        const { text, url, icon: Icon } = item;

        const isActive = activeTab === text;

        return (
          <Link
            key={text}
            to={url}
            onClick={() => setActiveTab(text)}
            className={`cursor-pointer h-full flex-1 flex justify-center items-center ${
              isActive ? "border-t-2 border-primary" : ""
            }`}
          >
            <Icon
              className={`w-6 ${
                isActive ? "fill-primary" : "fill-clr-100 opacity-70"
              }`}
            />
          </Link>
        );
      })}
    </footer>
  );
}
