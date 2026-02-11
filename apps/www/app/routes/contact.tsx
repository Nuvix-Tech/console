import { Background, Button, Card, Text } from "@nuvix/ui/components";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact Us - Nuvix" },
    { name: "description", content: "Get in touch with Nuvix support" },
  ];
}

export default function ContactPage() {
  return (
    <section className="flex flex-col relative overflow-hidden min-h-[60vh]">
      <Background
        dots={{ display: true, size: "8", opacity: 20, color: "neutral-solid-medium" }}
        height="xl"
        position="absolute"
        fillWidth
        zIndex={-1}
      />
      <div className="max-w-4xl mx-auto p-4 py-24 flex flex-col items-center gap-12">
        <div className="text-center space-y-4">
          <Text variant="display-default-l" as="h3">
            Contact Us
          </Text>
          <Text variant="body-default-l" onBackground="neutral-medium" as="p">
            Need help? Have a feature request? We're here.
          </Text>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full">
          <Card className="p-8 flex flex-col gap-4 items-start bg-white/50 backdrop-blur-sm border-neutral-200">
            <Text variant="heading-default-s">Email Support</Text>
            <Text variant="body-default-s" onBackground="neutral-medium">
              For account issues, billing, or direct inquiries.
            </Text>
            <Button variant="secondary" size="s" href="mailto:support@nuvix.in">
              support@nuvix.in
            </Button>
          </Card>

          <Card className="p-8 flex flex-col gap-4 items-start bg-white/50 backdrop-blur-sm border-neutral-200">
            <Text variant="heading-default-s">Community & Discussions</Text>
            <Text variant="body-default-s" onBackground="neutral-medium">
              Ask questions, share ideas, and chat with other builders.
            </Text>
            <Button
              variant="secondary"
              size="s"
              href="https://github.com/orgs/nuvix/discussions"
              target="_blank"
            >
              GitHub Discussions
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}
