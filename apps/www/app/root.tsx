import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import "@nuvix/ui/styles/index.scss";
import "@nuvix/ui/tokens/index.scss";
import "@nuvix/sui/globals.css";
import { MetaProvider } from "@nuvix/ui/contexts";
import { Link } from "react-router";
import { Provider } from "@nuvix/cui/provider";
import { usePathname } from "./hooks/usePathname";
import { useRouter } from "./hooks/useRouter";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-neutral="gray"
      data-brand={"custom"}
      data-accent={"custom"}
      data-border={"rounded"}
      data-solid={"color"}
      data-solid-style={"flat"}
      data-surface={"translucent"}
      data-transition={"all"}
      data-scaling={"100"}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <MetaProvider link={Link} img="img" usePathname={usePathname} useRouter={useRouter}>
        <body className="page-background">
          <Provider attribute={[]} defaultTheme="light" enableSystem={false} forcedTheme="light">
            {children}
          </Provider>
          <ScrollRestoration />
          <Scripts />
        </body>
      </MetaProvider>
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
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
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
