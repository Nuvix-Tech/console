"use client";
import { Badge, Column, Logo, NavIcon, Row } from "@/ui/components";
import { usePathname } from "next/navigation";
import type React from "react";
import { useRef } from "react";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerRoot,
} from "@/components/cui/drawer";
import { FirstSidebar, SecondSidebar } from "./sidebar";
import { HeaderOrganization, HeaderProject } from "./components";
import Link from "next/link";
import { Button } from "../ui/button";
import { UserProfile } from "../_profile";
import { useAppStore } from "@/lib/store";

interface HeaderProps {
  authenticated?: boolean;
  avatar?: string;
  name?: string;
  subline?: string;
}

const ProjectHeader: React.FC<HeaderProps> = () => {
  const organization = useAppStore.use.organization?.();
  const isDrawerOpen = useAppStore.use.isDrawerOpen();
  const isSecondMenuOpen = useAppStore.use.isSecondMenuOpen();
  const setIsDrawerOpen = useAppStore.use.setIsDrawerOpen();
  const setIsSecondMenuOpen = useAppStore.use.setIsSecondMenuOpen();
  const pathname = usePathname() ?? "";
  const headerRef = useRef<any>(null);

  return (
    <>
      <Row
        hide="s"
        as="header"
        // borderBottom="neutral-medium"
        fillWidth
        // position="fixed"
        zIndex={10}
        radius="l"
        gap="12"
        paddingX="m"
        height="64"
        vertical="center"
        background="surface"
        ref={headerRef}
      >
        <Row>
          <Link href="/">
            <div className="is-only-dark">
              <Logo icon={false} size="s" wordmarkSrc="/trademark/nuvix-logo-dark.svg" />
            </div>
            <div className="is-only-light">
              <Logo icon={false} size="s" wordmarkSrc="/trademark/nuvix-logo-light.svg" />
            </div>
          </Link>
        </Row>
        {/* <Badge
          effect
          hide="s"
          arrow={false}
          paddingX="16"
          paddingY="4"
          title="DEV"
          horizontal="center"
        /> */}
        <Row fillWidth vertical="center" horizontal="space-between">
          <Row vertical="center" gap={"2"}>
            {/* <span className="text-[var(--neutral-alpha-strong)] text-2xl">/</span>
            <HeaderOrganization /> */}
            <span className="text-[var(--neutral-alpha-medium)] text-2xl">/</span>
            <HeaderProject />
          </Row>
          <Row fillWidth vertical="center" horizontal="end" gap="12">
            <div className="flex items-center gap-3">
              {organization?.billingPlan === "tier-0" ? <Button>Upgrade</Button> : null}
              <Button variant="outline" className="bg-transparent">
                Feedback
              </Button>
              <div className="flex items-center gap-0.5">
                <Button variant="link">Help</Button>
                <Button variant="link">Docs</Button>
              </div>
            </div>
            <UserProfile />
          </Row>
        </Row>
      </Row>

      <Column
        show="s"
        as="header"
        borderBottom="neutral-medium"
        position="fixed"
        fillWidth
        zIndex={10}
        height="80"
        background="surface"
      >
        <Row fillWidth vertical="center" height="48" paddingX="m" borderBottom="neutral-weak">
          <Row gap="4" vertical="center">
            <Logo wordmark={false} size="l" iconSrc="/trademark/nuvix.svg" />
          </Row>
          <Badge hide="s" effect arrow={false}>
            DEV
          </Badge>
          <Row fillWidth vertical="center" horizontal="end">
            <Row as="nav">
              <Row>
                <NavIcon isActive={isDrawerOpen} onClick={() => setIsDrawerOpen(!isDrawerOpen)} />
                {/* <Avatar.Root size={'sm'}>
                  <Avatar.Fallback name={user?.name} />
                  <Avatar.Image src={avatars.getInitials(user?.name, 96, 96)} />
                </Avatar.Root> */}
              </Row>
            </Row>
          </Row>
        </Row>

        <Row fillWidth vertical="center" height="32" paddingX="m">
          <Row gap="4" vertical="center">
            <NavIcon
              isActive={isSecondMenuOpen}
              onClick={() => setIsSecondMenuOpen(!isSecondMenuOpen)}
            />
            {organization?.name}
          </Row>
          <Badge hide="s" effect arrow={false}>
            DEV
          </Badge>
          <Row fillWidth vertical="center" horizontal="end">
            <Row as="nav">
              <Row>
                {/* <Avatar.Root size={'sm'}>
                  <Avatar.Fallback name={user?.name} />
                  <Avatar.Image src={avatars.getInitials(user?.name, 96, 96)} />
                </Avatar.Root> */}
              </Row>
            </Row>
          </Row>
        </Row>
      </Column>

      <DrawerRoot open={isDrawerOpen} onOpenChange={(e) => setIsDrawerOpen(e.open)}>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerBody>
            <FirstSidebar alwaysFull noBg border={false} />
          </DrawerBody>
          <DrawerCloseTrigger top={1} right={1} />
        </DrawerContent>
      </DrawerRoot>

      <DrawerRoot
        open={isSecondMenuOpen}
        onOpenChange={(e) => setIsSecondMenuOpen(e.open)}
        placement="bottom"
      >
        <DrawerBackdrop />
        <DrawerContent offset="4" rounded="md">
          <DrawerBody>
            <SecondSidebar noBg noMarg border={false} />
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

ProjectHeader.displayName = "Header";

export { ProjectHeader };
