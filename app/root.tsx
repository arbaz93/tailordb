import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { useEffect, useState, useRef } from "react";
import { useColorSchemeStore } from './zustand/colorSchemeStore';
import { useContactStore } from "./zustand/contactStore";
import type { Route } from "./+types/root";
import "./app.css";
import { Header, Footer } from "./components";
import { navigationItems } from "~/utils/constants";
import { getContacts } from "./scripts/contactFetchFunctions";
import { getAuthStatus } from "./auth/auth";


export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const hydrate = useColorSchemeStore((s) => s.hydrate);
  const colorScheme = useColorSchemeStore((s) => s.colorScheme);
  const setAllContacts = useContactStore((s) => s.setAllContacts);
  const [fetchStatus, setFetchStatus] = useState<any>({
    status: 100,
    statusText: ''
  });
  const [activeTab, setActiveTab] = useState<string>('home');
  const location = useLocation();


  // Hydrate ColorScheme
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const handleContacts = async () => {
      try {
        const res = await getContacts();
  
        if (res?.data) {
          console.log(res.data);
          setAllContacts(res.data ?? []);
        }
  
        setFetchStatus({
          status: res.status,
          statusText: res.statusText,
        });
      } catch (err: any) {
        setFetchStatus({
          status: err?.status ?? 500,
          statusText: err?.message ?? 'Unknown error',
        });
      }
    };
    if (getAuthStatus() === '200') {
      handleContacts();
    }
  }, [
    getContacts,
    setFetchStatus,
    getAuthStatus,
  ]);
  
  useEffect(() => {
    const path = location.pathname.split('/')[1]; // first segment
    setActiveTab(path || 'home');
  }, [location.pathname]);

  return (
    <html lang="en" className={`${colorScheme}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="tailor, tailor database, manage tailors, tailor services, tailor profiles, find tailors, tailor locations" />
        <meta name="author" content="Yousaf Arbaz" />
        <Meta />
        <Links />
      </head>
      <body className={"bg-background " + (location.pathname != '/auth' && 'pb-13')}>

        {location.pathname != '/auth' &&
          <Header text={navigationItems[activeTab]?.text} icon={navigationItems[activeTab]?.icon} />
        }

        {children}

        {location.pathname != '/auth' &&
          <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
        }
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
