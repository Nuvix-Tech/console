"use client";
import { Badge, Column, Logo, NavIcon, Row, Button } from "@nuvix/ui/components";
import { usePathname } from "next/navigation";
import type React from "react";
import { useRef } from "react";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerRoot,
} from "@nuvix/cui/drawer";
import { FirstSidebar, SecondSidebar } from "./sidebar";
import { HeaderOrganization, HeaderProject } from "./components";
import Link from "next/link";
import { UserProfile } from "../_profile";
import { useAppStore } from "@/lib/store";

interface HeaderProps {
  authenticated?: boolean;
  avatar?: string;
  name?: string;
  subline?: string;
  isProjectDash: boolean;
}

const Header: React.FC<HeaderProps> = ({ isProjectDash }) => {
  return (
    <>
      <DesktopHeader isProjectDash={isProjectDash} />
      <MobileHeader />
    </>
  );
};

Header.displayName = "Header";

export { Header };

const DesktopHeader = ({ isProjectDash }: { isProjectDash: boolean }) => {
  const organization = useAppStore.use.organization?.();
  const headerRef = useRef<any>(null);

  return (
    <>
      <Row
        hide="s"
        as="header"
        fillWidth
        zIndex={8}
        gap="12"
        padding="8"
        height="64"
        minHeight="64"
        vertical="center"
        ref={headerRef}
        position="relative"
      >
        <Row
          className="absolute left-0 -z-1"
          background="surface"
          width={isProjectDash ? 4 : 14}
          height={"64"}
          as={"span"}
        />
        <Row marginLeft="8" marginRight="16">
          <Logo icon={false} size="l" className="is-only-dark" wordmarkSrc="/trademark/nuvix-logo-dark.svg" />
          <Logo icon={false} size="l" className="is-only-light" wordmarkSrc="/trademark/nuvix-logo-light.svg" />
        </Row>
        <Row fillWidth vertical="center" horizontal="space-between" marginLeft={isProjectDash ? undefined : '80'}>
          <Row vertical="center" gap={"8"}>
            <HeaderOrganization />
            {isProjectDash && (
              <>
                <HeaderProject />
                <Button variant="secondary">Connect</Button>
              </>
            )}
          </Row>
          <Row fillWidth vertical="center" horizontal="end" gap="12">
            <div className="flex items-center gap-3">
              {organization?.billingPlan === "tier-0" ? <Button>Upgrade</Button> : null}
              <Button variant="secondary" className="bg-transparent">
                Feedback
              </Button>
              <div className="flex items-center gap-0.5">
                <Button variant="tertiary">Help</Button>
                <Button variant="tertiary">Docs</Button>
              </div>
            </div>
            <UserProfile />
          </Row>
        </Row>
      </Row>
    </>
  );
};

const MobileHeader = () => {
  const organization = useAppStore.use.organization?.();
  const isDrawerOpen = useAppStore.use.isDrawerOpen();
  const isSecondMenuOpen = useAppStore.use.isSecondMenuOpen();
  const setIsDrawerOpen = useAppStore.use.setIsDrawerOpen();
  const setIsSecondMenuOpen = useAppStore.use.setIsSecondMenuOpen();

  return (
    <>
      <Column
        show="s"
        as="header"
        // borderBottom="neutral-medium"
        position="fixed"
        fillWidth
        zIndex={10}
        className={"h-24"}
        background="surface"
      >
        <Row fillWidth vertical="center" height="48" paddingX="m" borderBottom="neutral-medium">
          <Row gap="4" vertical="center">
            <Logo wordmark={false} size="l" iconSrc="/trademark/nuvix.svg" />
          </Row>
          <Row fillWidth vertical="center" horizontal="end">
            <Row as="nav">
              <Row>
                <NavIcon isActive={isDrawerOpen} onClick={() => setIsDrawerOpen(!isDrawerOpen)} />
              </Row>
            </Row>
          </Row>
        </Row>

        <Row fillWidth vertical="center" height="48" paddingX="m">
          <Row gap="4" vertical="center">
            <NavIcon
              isActive={isSecondMenuOpen}
              onClick={() => setIsSecondMenuOpen(!isSecondMenuOpen)}
            />
            <HeaderProject />
          </Row>
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
          <DrawerBody className="h-full">
            <SecondSidebar noBg noMarg border={false} />
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};
