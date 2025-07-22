"use client";
import { useAppStore } from "@/lib/store";
import { Stack, Tabs } from "@chakra-ui/react";
import { Column, Row, Text, Button } from "@nuvix/ui/components";
import { Fragment } from "react";
import { BodyWrapper } from "./_wrapper";

export const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppStore((s) => s);

  const tabs = [{ label: "Overview", key: "overview" }];

  return (
    <>
      <Column gap="16" paddingY="16">
        <BodyWrapper>
          <Button
            size="s"
            variant="tertiary"
            prefixIcon="chevronLeft"
            weight="default"
            className="!text-primary/70"
          >
            Back to dashboard
          </Button>
          <Row fillWidth horizontal="space-between" paddingX="16">
            <Text variant="heading-default-m">{user.name ?? "Account"}</Text>
            <Button size="s" variant="secondary">
              Logout
            </Button>
          </Row>
        </BodyWrapper>
        <Tabs.Root>
          <Tabs.List>
            {tabs.map((t, i) => (
              <Fragment key={i}>
                <Tabs.Trigger value={t.key}>{t.label}</Tabs.Trigger>
                <Tabs.Indicator />
              </Fragment>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </Column>
      <BodyWrapper>{children}</BodyWrapper>
    </>
  );
};
