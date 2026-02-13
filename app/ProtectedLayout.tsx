/**
 * Protected route layout
 * Ensures the user is authenticated before rendering child routes
 */

import { Outlet, redirect } from "react-router";
import { checkAuth } from "./auth/authVerification.server";

/* ---------------------------------------------------------------------- */
/*                                 Loader                                 */
/* ---------------------------------------------------------------------- */

/**
 * Route loader that runs on both server and client.
 * Redirects unauthenticated users to the auth page.
 */
export async function loader({
  request,
}: {
  request: Request;
}) {
  const isAuthenticated = checkAuth(request);

  if (!isAuthenticated) {
    // Redirect unauthenticated users
    throw redirect("/auth");
  }

  // Authenticated users may proceed
  return null;
}

/* ---------------------------------------------------------------------- */
/*                            Protected Layout                             */
/* ---------------------------------------------------------------------- */

/**
 * Wrapper layout for protected routes
 */
export default function ProtectedLayout() {
  return <Outlet />;
}
