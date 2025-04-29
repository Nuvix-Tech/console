"use client";
import { useEffect } from "react";
import { Button, Heading, Text } from "@nuvix/ui/components";
import { useRouter } from "next/navigation";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error occurred:", error);
  }, [error]);

  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-4">
      <Heading variant="heading-default-m">Oops! Something went wrong</Heading>
      <Text variant="body-default-s">We encountered an error while processing your request.</Text>
      {error.digest && <p className="text-sm text-gray-500">Error ID: {error.digest}</p>}
      <div className="flex gap-4">
        <Button onClick={reset} variant="primary">
          Try again
        </Button>
        <Button variant="secondary" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
}
