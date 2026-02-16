"use client";
import { useAppStore } from "@/lib/store";
import { Column, Row, Text, Button, SegmentedControl, useConfirm } from "@nuvix/ui/components";
import { BodyWrapper } from "./_wrapper";
import { usePathname } from "next/navigation";
import { sdkForConsole } from "@/lib/sdk";
import { toast } from "sonner";
import { useRouter } from "@bprogress/next";
import { isPlatform } from "@/lib/constants";

export const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppStore((s) => s);
  const path = usePathname();
  const selected = path?.split("/"); // /account/__path__
  const confirm = useConfirm();
  const { replace } = useRouter();

  const routes = [
    { value: "account", label: "Overview", href: "" },
    { value: "preference", label: "Preference" },
    { value: "sessions", label: "Sessions" },
    ...(isPlatform ? [{ value: "organizations", label: "Organizations" }] : []),
  ];

  async function onLogOut() {
    const isConfirmed = await confirm({
      title: "Log out",
      description: "Are you sure you want to log out of this session?",
      confirm: { text: "Log Out" },
    });

    if (isConfirmed) {
      try {
        await sdkForConsole.account.deleteSession("current");
        replace("/auth/login");
      } catch (error: any) {
        toast.error(error?.message || "Failed to sign out. Please try again.");
      }
    }
  }

  function getSelectedRoute() {
    const currentRoute = routes.filter(Boolean).find((r) => r.value === selected[2]);
    return currentRoute ? currentRoute.value : "account";
  }

  return (
    <>
      <Column gap="16" paddingY="16" background="neutral-alpha-weak">
        <BodyWrapper className="gap-4 flex flex-col py-0">
          <Button
            size="s"
            variant="tertiary"
            prefixIcon="chevronLeft"
            weight="default"
            href="/"
            className="opacity-80"
          >
            Back to dashboard
          </Button>
          <Row fillWidth horizontal="space-between">
            <Text variant="heading-strong-l" marginLeft="16">
              {user.name ?? "Account"}
            </Text>
            <Button size="s" variant="secondary" onClick={() => onLogOut()}>
              Logout
            </Button>
          </Row>
          <SegmentedControl
            fillWidth={false}
            defaultSelected={getSelectedRoute()}
            buttons={routes.map((r) => ({
              value: r.value,
              label: r.label,
              href: `/account/${r.href ?? r.value}`,
            }))}
            selected={getSelectedRoute()}
            onToggle={(value) => console.log(value)}
          />
        </BodyWrapper>
      </Column>
      <BodyWrapper>{children}</BodyWrapper>
    </>
  );
};
