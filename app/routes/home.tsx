/**
 * Home Page
 * Displays all contacts from the store in a grid layout.
 */

import type { Route } from "./+types/home";
import { Contacts, HeadingMedium } from "../components";
import { useContactStore } from "~/zustand/contactStore";
import { useEffect, useState } from "react";
import "../app.css";

/* -------------------------------------------------------------------------- */
/*                                  Meta                                      */
/* -------------------------------------------------------------------------- */

/**
 * Page meta data for SEO
 */
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tailor Database" },
    {
      name: "description",
      content:
        "Manage and discover tailors effortlessly with our web app. " +
        "Track tailor profiles, services, and locations in one intuitive " +
        "database designed for efficiency and convenience.",
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*                                 Home Page                                   */
/* -------------------------------------------------------------------------- */

export default function Home() {
  /* -------------------------- Store & State ---------------------------- */

  const allContacts = useContactStore((state) => state.allContacts);
  const [contacts, setContacts] = useState(allContacts);

  /**
   * Sync local contacts state whenever the store updates
   */
  useEffect(() => {
    setContacts(allContacts);
  }, [allContacts]);

  /* ----------------------------- Render -------------------------------- */

  return (
    <main className="flex w-full">
      <section className="flex-1 grid gap-4">
        <div
          className={`flex flex-col gap-1.25 px-8 pt-11 ${
            !allContacts.length ? "h-auto" : "h-[calc(100vh-120px)]"
          }`}
        >
          {/* Section heading */}
          <HeadingMedium text="All Contacts" css="mb-[11px]" />

          {/* Contact list */}
          <Contacts contacts={contacts} />
        </div>
      </section>
    </main>
  );
}
