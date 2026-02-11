import { Background, Text } from "@nuvix/ui/components";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About - Nuvix" },
    { name: "description", content: "About Nuvix - Infrastructure for Builders" },
  ];
}

export default function AboutPage() {
  return (
    <section className="flex flex-col relative overflow-hidden min-h-[60vh]">
      <Background
        dots={{ display: true, size: "8", opacity: 20, color: "neutral-solid-medium" }}
        height="xl"
        position="absolute"
        fillWidth
        zIndex={-1}
      />
      <div className="max-w-3xl mx-auto p-4 py-24 flex flex-col items-center text-center gap-8">
        <Text variant="display-default-l" as="h3">
          About Nuvix
        </Text>
        <Text
          variant="body-default-l"
          onBackground="neutral-medium"
          className="max-w-2xl leading-relaxed"
          as="p"
        >
          Nuvix is designed for builders who refuse to be slowed down by infrastructure. We provide
          high-performance, scalable backend services — Database, Auth, Storage, and Messaging —
          wrapped in a developer experience that actually makes sense.
        </Text>
        <Text variant="body-default-m" onBackground="neutral-medium" className="max-w-2xl" as="p">
          Built with precision. Deployed with speed. Nuvix is the foundation for your next
          breakthrough.
        </Text>
      </div>
    </section>
  );
}
