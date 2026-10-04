import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AdminShell } from "../components/AdminShell";
import { ThemeProvider } from "../context/ThemeContext";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-space-grotesk" });

export const metadata = {
  title: "Katabazaar Admin Command Center",
  description: "Zero-Trust command center for Katabazaar commerce, monitoring, and security operations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider>
          <Script id="global-error-handler" strategy="beforeInteractive">{`
            (function() {
              function reportError(msg, src, line, col, err) {
                try {
                  fetch('/api-proxy/api/v1/client-errors', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    keepalive: true,
                    body: JSON.stringify({
                      message: msg || 'Unknown error',
                      stack: (err && err.stack) || (src + ':' + line + ':' + col),
                      path: window.location.pathname,
                      userAgent: navigator.userAgent,
                      source: 'admin-web-window-onerror',
                    }),
                  });
                } catch(e) {}
              }
              window.onerror = function(msg, src, line, col, err) {
                reportError(msg, src, line, col, err);
                return false;
              };
              window.addEventListener('unhandledrejection', function(ev) {
                var reason = ev.reason;
                reportError(
                  (reason && reason.message) || String(reason) || 'Unhandled Promise Rejection',
                  '', 0, 0,
                  reason instanceof Error ? reason : null
                );
              });
            })();
          `}</Script>
          <AdminShell>{children}</AdminShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
