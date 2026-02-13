/**
 * Application route definitions
 */

import { index, route } from "@react-router/dev/routes";

export default [
  /* -------------------------------------------------------------------- */
  /*                              Public Routes                            */
  /* -------------------------------------------------------------------- */

  // Authentication page (login / signup)
  route("auth", "./routes/auth.tsx"),

  // Standalone error page
  route("error", "./routes/error.tsx"),

  /* -------------------------------------------------------------------- */
  /*                           Protected Routes                            */
  /* -------------------------------------------------------------------- */

  // Routes wrapped by ProtectedLayout (auth required)
  route(null, "./ProtectedLayout.tsx", [
    // Home page (/)
    index("./routes/home.tsx"),

    // View contact by encoded identifier (/contact/:encodedData)
    route("contact/:encodedData", "./routes/contact.tsx"),

    // Create new contact (/contact)
    route("contact", "./routes/newContact.tsx"),

    // Search page (/search)
    route("search", "./routes/search.tsx"),

    // About page (/about)
    route("about", "./routes/about.tsx"),
  ]),
];
