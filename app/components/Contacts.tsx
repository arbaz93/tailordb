import { useRef } from "react";
import { useLocation } from "react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import ContactBox from "./ContactBox";
import { PhantomBox } from ".";
import { useContactStore } from "~/zustand/contactStore";
import type { Contact } from "~/types/contact";

/* ----------------------------- Props ---------------------------------- */
type ContactsProps = {
  contacts: Contact[];
};

/* -------------------------- Component --------------------------------- */
export default function Contacts({ contacts }: ContactsProps) {
  const contactLoadStatus = useContactStore((state) => state.contactLoadStatus);
  const location = useLocation();

  // Reference to the scrollable container (virtualizer)
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reference to outer container to get height
  const parentRef = useRef<HTMLDivElement>(null);

  /* -------------------- Virtualizer Setup ----------------------------- */
  const virtualizer = useVirtualizer({
    count: contacts.length, // total number of items
    getScrollElement: () => scrollRef.current, // scrollable container
    estimateSize: () => 77, // estimated height of each item
    overscan: 5, // render extra items above/below for smooth scrolling
  });

  /* ------------------- Loading Placeholder --------------------------- */
  if (contactLoadStatus === "loading") {
    return <PhantomBox numberOfPhantomBoxes={10} css="h-[72px] w-full" />;
  }

  const virtualItems = virtualizer.getVirtualItems();

  // Determine height of parent container (fallback 550px)
  const parentHeight = parentRef.current
    ? getComputedStyle(parentRef.current).height
    : "550px";

  /* ---------------------------- Render -------------------------------- */
  return (
    <div className="flex-1" ref={parentRef}>
      <div
        ref={scrollRef}
        style={{
          height: parentHeight,
          overflow: "auto",
          width: "100%",
          paddingBottom: "48px",
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`, // total virtual height
            position: "relative",
            width: "100%",
          }}
        >
          {virtualItems.map((item) => (
            <div
              key={item.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${item.size}px`,
                transform: `translateY(${item.start}px)`,
              }}
            >
              <ContactBox contact={contacts[item.index]} index={item.index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
