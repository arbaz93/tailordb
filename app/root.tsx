/**
 * Root application layout and error handling
 */

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { useEffect, useRef, useState } from "react";

import type { Route } from "./+types/root";

/* ----------------------------- GSAP ----------------------------- */
let gsap;
if (typeof window !== 'undefined') {
  gsap = await import('gsap');
}
import { useGSAP } from '@gsap/react';
if(gsap) {
  gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies 
}

/* ----------------------------- Components ----------------------------- */
import {
  Header,
  Footer,
  NotificationBox,
  SplashScreen,
} from "./components";
import Error from "./routes/error";
import "./app.css";

/* ------------------------------- Stores -------------------------------- */
import { useColorSchemeStore } from "./zustand/colorSchemeStore";
import { useLoginStore } from "./zustand/loginStore";

/* ------------------------------- Utils --------------------------------- */
import { navigationItems } from "~/utils/constants";
import { getContacts } from "./scripts/contactAndMeasurementFetchFunctions";
import { getAuthStatus } from "./auth/auth";

/* ---------------------------------------------------------------------- */
/*                               <Links />                                */
/* ---------------------------------------------------------------------- */

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

/* ---------------------------------------------------------------------- */
/*                               Layout                                   */
/* ---------------------------------------------------------------------- */

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  /* ------------------------------ State -------------------------------- */

  const hydrateColorScheme = useColorSchemeStore((s) => s.hydrate);
  const colorScheme = useColorSchemeStore((s) => s.colorScheme);

  const loginInfo = useLoginStore((s) => s.loginInfo);

  const [activeTab, setActiveTab] = useState("home");
  const [pageReady, setPageReady] = useState(false);

  const pageRef = useRef<HTMLDivElement | null>(null)
  /* -------------------------- Effects ---------------------------------- */

  /**
   * Hydrate persisted color scheme on first load
   */
  useEffect(() => {
    hydrateColorScheme();
    setPageReady(true);


    if("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js")
    }
  }, [hydrateColorScheme]);

  /**
   * Fetch contacts only when user is authenticated
   * and login info changes
   */
  useEffect(() => {
    if (getAuthStatus() !== 200) return;

    const fetchContacts = async () => {
      try {
        await getContacts();
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    fetchContacts();
  }, [loginInfo]);


    /**
   * Animate page when route is changed
   */

  useGSAP(() => {
    if (typeof window === 'undefined' || !pageRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power1.out' } });

    // Fade out very subtly (slight scale down)
    tl.to(pageRef.current, {
      opacity: 0,
      scale: 0.995,
      duration: 0.1
    });

    // Fade in gently with scale back to normal
    tl.fromTo(
      pageRef.current,
      { opacity: 0, scale: 0.995 },
      { opacity: 1, scale: 1, duration: .5 },
      '-=0.1' // slight overlap for smoothness
    );

    return () => tl.kill();
  }, [location.pathname]);

  /**
   * Update active navigation tab based on URL
   */

  useEffect(() => {
    const pathSegment = location.pathname.split("/")[1];
    setActiveTab(pathSegment || "home");
  }, [location.pathname]);

  /* ------------------------------ Render -------------------------------- */

  const isAuthPage = location.pathname === "/auth";

  return (
    <html lang="en" className={colorScheme}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link href="/title-logo.png" rel="icon" />
        <meta
          name="keywords"
          content="tailor, tailor database, manage tailors, tailor services, tailor profiles, find tailors, tailor locations"
        />
        <link rel="shortcut icon" href="icons/pwa-192x192.png" type="image/x-icon" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="author" content="Yousaf Arbaz" />
       
        <Meta />
        <Links />
      </head>

      <body className="bg-background">
        {/* App boot splash */}
        <SplashScreen display={!pageReady} pulse />

        {/* Scroll anchor */}
        <div id="top" className="absolute w-0 h-0" />

        {/* Global notifications */}
        <NotificationBox />

        {/* Header (hidden on auth page) */}
        {!isAuthPage && (
          <Header
            text={navigationItems[activeTab]?.text}
            icon={navigationItems[activeTab]?.icon}
          />
        )}

        {/* Route content */}
        <div ref={pageRef}>

        {children}
        </div>

        {/* Footer (hidden on auth page) */}
        {!isAuthPage && (
          <Footer
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/* ---------------------------------------------------------------------- */
/*                                App                                     */
/* ---------------------------------------------------------------------- */

/**
 * Outlet wrapper for nested routes
 */
export default function App() {
  return <Outlet />;
}

/* ---------------------------------------------------------------------- */
/*                           Error Boundary                                */
/* ---------------------------------------------------------------------- */

export function ErrorBoundary({
  error,
}: Route.ErrorBoundaryProps) {
  let status: number | string = 500;
  let message = "Something went wrong";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <main className="min-h-screen">
      <Error status={status} message={message} />

      {/* Development-only stack trace */}
      {import.meta.env.DEV &&
        error instanceof Error &&
        error.stack && (
          <pre className="mx-auto mt-6 max-w-4xl overflow-x-auto rounded-xl bg-bg-200 p-4 text-text-200 text-clr-300">
            <code>{error.stack}</code>
          </pre>
        )}
    </main>
  );
}
