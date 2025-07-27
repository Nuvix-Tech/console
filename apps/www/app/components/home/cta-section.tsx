import { Button, Column, Icon, Input, Row, Text } from "@nuvix/ui/components";
import { useEffect, useState } from "react";
import { nuvix } from "~/lib/sdk";

export const CtaSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const STORAGE_KEY = "nuvix-waitlisted";

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) {
      setIsJoined(true);
    }
  }, []);

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleJoin = async () => {
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setIsSubmitting(true);

    try {
      await nuvix.client.call("post", new URL(nuvix.client.config.endpoint + "/users/waitlist"), {
        email,
      });

      localStorage.setItem(STORAGE_KEY, "true");
      setIsJoined(true);
      setIsNew(true);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="py-24 relative overflow-hidden">
      <Column
        background="neutral-alpha-weak"
        className="max-w-4xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8"
        radius="l"
        center
        border="neutral-alpha-weak"
      >
        <Row gap="12" vertical="center">
          <Icon name="rocket" size="l" />
          <Text variant="heading-default-xl">Be Among the First to Build with Nuvix</Text>
        </Row>

        <Text
          className="text-center max-w-10/12"
          variant="body-default-s"
          onBackground="neutral-weak"
          marginTop="4"
        >
          Get early access to a high-performance backend platform designed for speed, scale, and
          developer freedom. Join the waitlist and shape the future of modern app development.
        </Text>

        <Row gap="12" center className="mt-10 w-full max-w-[480px]">
          {isJoined ? (
            isNew ? (
              <Column center textVariant="body-default-s" onBackground="neutral-weak">
                <Text variant="label-strong-m" onBackground="success-medium" className="mb-1">
                  🎉 You're In!
                </Text>
                Thanks for joining the waitlist. You're now one step closer to building with Nuvix -
                a high-performance backend platform designed for speed, scale, and developer-first
                freedom. We'll keep you updated with early access invites, product updates, and
                opportunities to shape what's next.
              </Column>
            ) : (
              <Text
                variant="body-default-m"
                onBackground="success-medium"
                className="text-center w-full"
              >
                🎉 You're already on the waitlist!
              </Text>
            )
          ) : (
            <>
              <Input
                labelAsPlaceholder
                label="Enter your email"
                height="s"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
              <Button
                onClick={handleJoin}
                disabled={isSubmitting}
                className="!h-[38px] !min-h-[38px]"
              >
                {isSubmitting ? "Joining..." : "Join Waitlist"}
              </Button>
            </>
          )}
        </Row>

        {error && (
          <Text variant="body-default-s" className="text-danger mt-4 text-center">
            {error}
          </Text>
        )}
      </Column>
    </section>
  );
};
