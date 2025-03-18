"use client";
import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error occurred:", error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-3xl font-bold">Oops! Something went wrong</h1>
      <p className="text-gray-600">We encountered an error while processing your request.</p>
      {error.digest && (
        <p className="text-sm text-gray-500">Error ID: {error.digest}</p>
      )}
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
        >
          Try again
        </button>
        <Link 
          href="/project"
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100 transition-colors"
        >
          Go back
        </Link>
      </div>
    </div>
  );
}
