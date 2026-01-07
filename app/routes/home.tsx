import type { Route } from "./+types/home";
import { Contacts, HeadingMedium, RoundButtonSection, SplashScreen } from "../components";
import { useContactStore } from "~/zustand/contactStore";
import { useEffect, useState } from "react";
import type { Contact } from "~/types/contact";
import '../app.css'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Tailor Database" },
    { name: "description", content: "Manage and discover tailors effortlessly with our web app. Track tailor profiles, services, and locations in one intuitive database designed for efficiency and convenience." },
  ];
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const allContacts = useContactStore(state => state.allContacts);
  const [contacts, setContacts] = useState(allContacts);

  function handleContactsSortingByGender(gender:string) {
    const lowerCaseGender = gender.toLowerCase()
    const filteredContacts = (lowerCaseGender === "male" || lowerCaseGender === "female") ? allContacts.filter((contact) => contact?.gender === gender) : allContacts;
    console.log(gender)
    setContacts(filteredContacts);
  }

  useEffect(() => {
    setContacts(allContacts);
  }, [allContacts])
  return (
    <main className="">
      {isLoading ?
        <SplashScreen display={isLoading} pulse={false} /> :
        <section className="grid gap-4">
          <div className="grid gap-4 px-8 py-10 border-b border-border-clr ">
            <HeadingMedium text="Categories" css='' />
            <RoundButtonSection callback={handleContactsSortingByGender} />
          </div>
          <div className="grid gap-4 px-8 pb-11">
            <HeadingMedium text="All Contacts" css='' />
            <Contacts contacts={contacts}/>
          </div>
        </section>
      }
    </main>
  )
}
