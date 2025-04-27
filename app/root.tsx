import { useEffect } from "react";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

// Create a custom theme for Material UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#f9695e', // A warm, romantic red color
    },
    secondary: {
      main: '#6b7280', // A cool gray for contrast
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // Don't uppercase button text
    },
  },
  shape: {
    borderRadius: 8, // Slightly rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none', // No shadow by default
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Add shadow on hover
          },
        },
      },
    },
  },
});

export default function App() {
  // Initialize database when app loads
  useEffect(() => {
    // This effect runs on the client-side only
    const initDb = async () => {
      try {
        // Dynamic import to avoid server-side issues
        const { initSchema } = await import("~/utils/db.server");
        await initSchema();
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    if (typeof window !== "undefined") {
      initDb();
    }
  }, []);

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* Provides a consistent baseline CSS */}
          <Outlet />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>Oops! Something went wrong</title>
      </head>
      <body className="h-full flex items-center justify-center bg-gray-50">
        <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {isRouteErrorResponse(error)
              ? `${error.status} ${error.statusText}`
              : "Application Error"}
          </h1>
          <p className="text-gray-600 mb-6">
            {isRouteErrorResponse(error)
              ? "Sorry, the page you're looking for couldn't be found or has an error."
              : "Sorry, an unexpected error occurred."}
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Return to Homepage
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}