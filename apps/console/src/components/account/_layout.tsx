"use client";
import { useAppStore } from "@/lib/store";
import { Column, Row, Text, Button, SegmentedControl } from "@nuvix/ui/components";
import { BodyWrapper } from "./_wrapper";

export const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppStore((s) => s);

  return (
    <>
      <Column gap="16" paddingY="16" background="neutral-alpha-weak">
        <BodyWrapper className="gap-4 flex flex-col py-0">
          <Button
            size="s"
            variant="tertiary"
            prefixIcon="chevronLeft"
            weight="default"
            className="!text-primary/70"
          >
            Back to dashboard
          </Button>
          <Row fillWidth horizontal="space-between">
            <Text variant="heading-strong-l" marginLeft="16">
              {user.name ?? "Account"}
            </Text>
            <Button size="s" variant="secondary">
              Logout
            </Button>
          </Row>
          <SegmentedControl
            fillWidth={false}
            defaultSelected="overview"
            buttons={[
              { value: "overview", label: "Overview" },
              { value: "sessions", label: "Sessions" },
              { value: "organizations", label: "Organizations" },
            ]}
            onToggle={(value) => console.log(value)}
          />
        </BodyWrapper>
      </Column>
      <BodyWrapper>{children}</BodyWrapper>
    </>
  );
};
