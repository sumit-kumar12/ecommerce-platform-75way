import React from "react";
import Link from "next/link";
import { Astronaut } from "../components/illustrations/Astronaut";

export const metadata = {
  title: "Page Not Found | Katabazaar",
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-dark p-4">
      <div className="text-center max-w-md mx-auto flex flex-col items-center">
        <Astronaut className="w-48 h-48 mb-6 animate-float" aria-hidden="true" />
        <h1 className="text-6xl font-extrabold text-gradient-primary mb-2">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Oops! Page not found</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/products" className="btn-ghost">
            Go to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
