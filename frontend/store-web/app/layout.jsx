import { Inter, Space_Grotesk, Public_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AnalyticsTracker } from "../components/AnalyticsTracker";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata = {
  title: "Katabazaar \u2014 Premium Digital Marketplace",
  description: "Curated multi-category marketplace with express worldwide delivery and verified premium merchant support.",
  metadataBase: new URL('https://katabazaar.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Katabazaar \u2014 Premium Digital Marketplace",
    description: "Curated multi-category marketplace with express worldwide delivery and verified premium merchant support.",
    url: 'https://katabazaar.com',
    siteName: 'Katabazaar',
    images: [
      {
        url: '/icon.svg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${publicSans.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background-dark text-slate-100 selection:bg-primary selection:text-white`}>
        {/* Global error handler — catches JS errors outside React error boundaries */}
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
                    source: 'store-web-window-onerror',
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
        {children}
        <AnalyticsTracker />
      </body>
    </html>
  );
}
