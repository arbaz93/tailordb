import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { useEffect, useState } from "react";
import { useColorSchemeStore } from './zustand/colorSchemeStore';
import type { Route } from "./+types/root";
import "./app.css";
import { Header, Footer } from "./components";
import { navigationItems } from "~/utils/constants";
import { getContacts } from "./scripts/contactAndMeasurementFetchFunctions";
import { getAuthStatus } from "./auth/auth";
import Error from "./routes/error";
import { useLoginStore } from "./zustand/loginStore";

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
  const [fetchStatus, setFetchStatus] = useState<any>({
    status: 100,
    statusText: ''
  });
  const [activeTab, setActiveTab] = useState<string>('home');
  const location = useLocation();
  const loginInfo = useLoginStore(s => s.loginInfo)

  // Hydrate ColorScheme
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const handleContacts = async () => {
      try {
        const res = await getContacts();
  
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
    if (getAuthStatus() === 200) {
      handleContacts();
    }
  }, [
    setFetchStatus,
    loginInfo
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
      <body className={"bg-background"}>
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
  let status: number | string = 500;
  let message = "Something went wrong";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || message;
  } else if (error instanceof Error) {
    message = error?.message;
  }

  return (
    <main className="min-h-screen">
      <Error status={status} message={message} />

      {/* DEV-only stack trace */}
      {import.meta.env.DEV && error instanceof Error && error.stack && (
        <pre className="mx-auto mt-6 max-w-4xl rounded-xl bg-bg-200 p-4 text-text-200 text-clr-300 overflow-x-auto">
          <code>{error.stack}</code>
        </pre>
      )}
    </main>
  );
}
