import lunr from "lunr";

import type { Contact } from "~/types/contact";


export function createContactIndex(contacts: Contact[]) {
  return lunr(function () {
    this.ref("id");
    this.field("name");
    this.field("phone");

    contacts.forEach(contact => {
      this.add(contact);
    });
  });
}

export function searchQuery(
  query: string,
  index: lunr.Index,
  contacts: Contact[]
): Contact[] {
  if (!query.trim()) return contacts;

  const fuzzyQuery = query
    .split(" ")
    .map(word => `${word}~1 ${word}*`)
    .join(" ");

  const results = index.search(fuzzyQuery);

  const contactMap = new Map(
    contacts.map(c => [c.id, c])
  );

  return results
    .map(r => contactMap.get(r.ref))
    .filter((c): c is Contact => Boolean(c));
}
