import { Column, Row, Text, Button } from "@nuvix/ui/components";

export const HeroV2 = () => {
  return (
    <div className="mx-4 my-2 container mx-auto">
      <Column minHeight={"xl"} solid="accent-weak" radius="xs" padding="20" onSolid="accent-weak">
        <Row gap="8" marginTop="48" paddingY="24" paddingX="12">
          <Column className="max-w-xs">
            <Text variant="display-strong-s" onSolid="neutral-strong">
              Start simple.
              <br />
              Scale your way.
            </Text>

            <Button variant="secondary" size="m" className="mt-8">
              Get Started
            </Button>
          </Column>
        </Row>
      </Column>
    </div>
  );
};
