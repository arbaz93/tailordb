import { index, route } from "@react-router/dev/routes";

export default [
  // Public route
  route("auth", "./routes/auth.tsx"),
  route("error", "./routes/error.tsx"),
  
  // Protected layout
  route(null, "./ProtectedLayout.tsx", [
    index("./routes/home.tsx"),
    route("contact/:encodedData", "./routes/contact.tsx"), // /customer
    route("newcontact", "./routes/newContact.tsx"), // / new Contact
    route("search", "./routes/search.tsx"), // /searxh
    route("about", "./routes/about.tsx"), // /about
  ]),
];
