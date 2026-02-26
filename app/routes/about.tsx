/**
 * About page
 * Displays app branding, business details, and developer credit
 */

import { useColorSchemeStore } from "~/zustand/colorSchemeStore";
import { useNotificationStore } from "~/zustand/notificationStore";

import logoBlack from "../assets/logo black.svg";
import logoWhite from "../assets/logo-white-black.svg";

import { UserIcon } from "~/icons/nav/NavigationIcons";
import {
  PhoneFilledIcon,
  ClockIcon,
  PinFilledIcon,
  CodeIcon,
} from "~/icons/miscIcons";

import { aboutUs } from "~/utils/aboutus";
import { Button100 } from "~/components";
import { handleLogout } from "~/auth/auth";

export default function About() {
  /* ------------------------------ State -------------------------------- */

  const colorScheme = useColorSchemeStore((state) => state.colorScheme);
  const notification = useNotificationStore((state) => state.notification);
  /**
   * Select logo based on current color scheme
   */
  const logo = colorScheme === "dark" ? logoWhite : logoBlack;

  /* ------------------------------ Render -------------------------------- */

  return (
    /**
     * Height calculation:
     * 100vh - footer height (48px) - header height (60px)
     */
    <main className="flex h-[calc(100dvh-48px-60px)] flex-col items-center justify-between px-8 pb-5 pt-15 font-medium text-text-100 text-clr-100">
      {/* ------------------------------------------------------------------ */}
      {/*                           App Info Section                          */}
      {/* ------------------------------------------------------------------ */}

      <section className="grid gap-8">
        {/* Logo */}
        <div className="w-full overflow-hidden rounded-lg bg-bg-100 p-6">
          <img
            src={logo}
            alt="Application logo"
            className="m-auto w-32"
          />
        </div>

        {/* Business details */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <UserIcon className="w-4.5 fill-clr-100" />
            <p className="flex-1">{aboutUs.name}</p>
          </div>

          <div className="flex items-center gap-4">
            <PinFilledIcon className="w-4 fill-clr-100" />
            <p className="flex-1">{aboutUs.location}</p>
          </div>

          <div className="flex items-center gap-4">
            <PhoneFilledIcon className="w-5 fill-clr-100" />
            <p className="flex-1">{aboutUs.phone}</p>
          </div>

          <div className="flex items-center gap-4">
            <ClockIcon className="w-5 fill-clr-100" />
            <p className="flex-1">{aboutUs.timing}</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*                       Developer & Actions                           */}
      {/* ------------------------------------------------------------------ */}

      <section className="grid gap-4">
        {/* Developer credit */}
        <div className="flex w-full justify-center gap-4">
          <CodeIcon className="w-4.5 fill-clr-100" />
          <p className="flex-1 text-text-200">
            Designed &amp; Developed by{" "}
            <a
              href="mailto:yousafarbaz.dev@gmail.com"
              target="_blank"
              rel="noreferrer"
              className="text-primary"
            >
              Yousaf Arbaz
            </a>
          </p>
        </div>

        {/* Logout */}
        <Button100
          text="LOGOUT"
          css="bg-danger text-white"
          callback={handleLogout}
        />
      </section>
    </main>
  );
}
