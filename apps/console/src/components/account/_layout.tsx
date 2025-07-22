"use client";
import { useAppStore } from "@/lib/store";
import { Column, Row, Text, Button, SegmentedControl } from "@nuvix/ui/components";
import { BodyWrapper } from "./_wrapper";
import { usePathname } from "next/navigation";

export const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppStore((s) => s);
  const path = usePathname();
  const selected = path?.split("/"); // /account/__path__

  const routes = [
    { value: "account", label: "Overview", href: "" },
    { value: "preference", label: "Preference" },
    { value: "sessions", label: "Sessions" },
    { value: "organizations", label: "Organizations" },
  ];

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
            defaultSelected={selected.length && selected[2] ? selected[2] : "account"}
            buttons={routes.map((r) => ({
              value: r.value,
              label: r.label,
              href: `/account/${r.href ?? r.value}`,
            }))}
            onToggle={(value) => console.log(value)}
          />
        </BodyWrapper>
      </Column>
      <BodyWrapper>{children}</BodyWrapper>
    </>
  );
};
