import { Outlet, redirect } from "react-router";
import { checkAuth } from "./auth/authVerification.server";


export async function loader({ request }: { request: Request }) {
  if (!checkAuth(request)) {
    throw redirect("/auth"); // ✅ redirect works server + client
  } else {
      
  }
  return null;
}

export default function ProtectedLayout() {

  return <Outlet />;
}
