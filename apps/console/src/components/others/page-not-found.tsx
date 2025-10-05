"use client";
import { Button, Heading, Text } from "@nuvix/ui/components";
import { CodeBlock } from "@nuvix/ui/modules";
import { useRouter } from "next/navigation";

interface ErrorProps {
  error: Error & { digest?: string };
}

export default function NotFoundPage({ error }: ErrorProps) {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4 relative">
      <Heading as="h1" variant="display-strong-l" marginBottom="32">
        404
      </Heading>
      <Heading variant="heading-default-m" marginBottom="16">
        Oops! This page was eaten by a black hole
      </Heading>
      <Text variant="body-default-s" marginTop="8" onBackground="neutral-weak">
        {error.message || "The page you are looking for does not exist or an error occurred."}
      </Text>
      {error.digest && <p className="text-sm text-gray-500">Error ID: {error.digest}</p>}
      <div className="flex gap-4 mt-16 mb-2">
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
      <div className="absolute bottom-4 text-center">
        <Text variant="body-default-xs" onBackground="neutral-weak">
          Don't worry, even black holes occasionally spit things back out. Maybe refresh the page?
        </Text>
      </div>
    </div>
  );
}
