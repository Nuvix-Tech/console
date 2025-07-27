import { Button, Column, Icon, Input, Row, Text } from "@nuvix/ui/components";

export const CtaSection = () => {

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
          <Text variant="heading-default-xl">
            Be Among the First to Build with Nuvix
          </Text>
        </Row>
        <Text className="text-center max-w-10/12" variant="body-default-s" onBackground="neutral-weak" marginTop="4">
          Get early access to a high-performance backend platform designed for speed, scale, and developer freedom.
          Join the waitlist and shape the future of modern app development.
        </Text>
        <Row gap="12" center className="mt-10">
          <Input labelAsPlaceholder label="Enter you email" height="s" />
          <Button className="!h-[38px] !min-h-[38px]">
            Join Waitlist
          </Button>
        </Row>
      </Column>
    </section>
  );
};
