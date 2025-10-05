"use client";
import { NuvixException } from "@nuvix/console";
import { cn } from "@nuvix/sui/lib/utils";
import { Button, Heading, Text } from "@nuvix/ui/components";
import { CodeBlock } from "@nuvix/ui/modules";
import { useRouter } from "next/navigation";
import type React from "react";
import NotFoundPage from "./page-not-found";

interface ErrorProps {
  error: Error & { digest?: string; code?: number };
  reset?: () => void;
}

export default function ErrorPage({
  error,
  reset,
  className,
  ...rest
}: ErrorProps & React.ComponentProps<"div">) {
  const router = useRouter();
  let message = error.message || "We encountered an error while processing your request.";

  if (error instanceof NuvixException) {
    message = error.message;
  } else if (message.toLowerCase().includes("network")) {
    message = "A network error occurred. Please check your connection and try again.";
  } else if (message.toLowerCase().includes("timeout")) {
    message = "The request timed out. Please try again later.";
  }

  if (error.code === 404) {
    return <NotFoundPage error={error} />;
  }

  return (
    <div
      className={cn("flex h-screen flex-col items-center justify-center gap-6 p-4", className)}
      {...rest}
    >
      <Heading variant="heading-default-m">Oops! Something went wrong</Heading>
      <Text variant="body-default-s">{message}</Text>
      {error.digest && <p className="text-sm text-gray-500">Error ID: {error.digest}</p>}
      <div className="flex gap-4">
        {reset && (
          <Button onClick={reset} variant="primary">
            Try again
          </Button>
        )}
        <Button variant="secondary" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
      {process.env.NODE_ENV !== "production" && (
        <CodeBlock
          codeInstances={[{ code: JSON.stringify(error), language: "json", label: "Json" }]}
          maxWidth="xs"
          compact
        />
      )}
    </div>
  );
}
