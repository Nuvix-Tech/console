import { Button, Column, Text } from "@nuvix/ui/components";
import { DOCS_URL } from "~/lib/constants";

export const BottomCtaSection = () => {
  return (
    <div className="container mx-auto px-4">
      <Column className="py-12 relative min-h-96 rounded-sm my-8 bg-(--brand-alpha-weak) dark:bg-(--neutral-alpha-weak) px-4">
        <div className="mx-auto max-w-3xl text-center my-auto">
          <Text variant="display-strong-s" as="h2" onBackground="neutral-strong">
            Let's build something great{" "}
            <strong className="accent-on-background-weak">together!</strong>
          </Text>
          <Text onBackground="neutral-weak" as="p">
            Nuvix is an open-source backend platform that empowers developers to build modern
            applications with ease. Join our community and start building today.
          </Text>
          <div className="mt-6 flex justify-center gap-8">
            <Button href={"https://github.com/Nuvix-Tech/nuvix"}>View on GitHub</Button>
            <Button variant="secondary" href={DOCS_URL}>
              Read the Docs
            </Button>
          </div>
        </div>
      </Column>
    </div>
  );
};
