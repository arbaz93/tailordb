import { index, route } from "@react-router/dev/routes";

export default [
  // Public route
  route("auth", "./routes/auth.tsx"),
  
  // Protected layout
  route(null, "./ProtectedLayout.tsx", [
    index("./routes/home.tsx"),
    route("contact/:id", "./routes/contact.tsx"), // /customer
    route("search", "./routes/search.tsx"), // /searxh
    route("about", "./routes/about.tsx"), // /about
  ]),
];
