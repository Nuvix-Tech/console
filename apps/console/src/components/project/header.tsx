"use client";
import { Column, Logo, NavIcon, Row, Button } from "@nuvix/ui/components";
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
import {
  ConnectButton,
  FeedbackButton,
  HeaderOrganization,
  HeaderProject,
  HelpButton,
} from "./components";
import { UserProfile } from "../_profile";
import { useAppStore, useProjectStore } from "@/lib/store";

interface HeaderProps {
  authenticated?: boolean;
  avatar?: string;
  name?: string;
  subline?: string;
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <>
      <DesktopHeader />
      <MobileHeader />
    </>
  );
};

Header.displayName = "Header";

export { Header };

const DesktopHeader = () => {
  const organization = useAppStore.use.organization?.();
  const headerRef = useRef<any>(null);

  return (
    <>
      <Row
        className="!hidden ml:!flex"
        as="header"
        fillWidth
        zIndex={8}
        gap="12"
        padding="8"
        height="48"
        minHeight="48"
        vertical="center"
        ref={headerRef}
        position="relative"
      >
        <Row
          className="absolute left-0 z-1 flex items-center justify-center"
          background="surface"
          width={3.5}
          height={"48"}
          as={"span"}
        >
          <Logo wordmark={false} size="m" iconSrc="/trademark/nuvix.svg" />
        </Row>

        <Row fillWidth vertical="center" horizontal="space-between" className="ml:pl-14">
          <Row vertical="center" gap={"8"}>
            <HeaderOrganization />
            <HeaderProject />
            <ConnectButton />
          </Row>
          <Row fillWidth vertical="center" horizontal="end" gap="12">
            <div className="flex items-center gap-3">
              {/* {organization?.billingPlan === "tier-0" ? (
                <Button size="s">
                  Upgrade
                </Button>
              ) : null} */}
              <FeedbackButton />
              <div className="flex items-center gap-0.5">
                <HelpButton />
                <Button size="s" variant="tertiary" href="https://docs.nuvix.in" target="_blank">
                  Docs
                </Button>
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
  const isDrawerOpen = useAppStore.use.isDrawerOpen();
  const isSecondMenuOpen = useAppStore.use.isSecondMenuOpen();
  const setIsDrawerOpen = useAppStore.use.setIsDrawerOpen();
  const setIsSecondMenuOpen = useAppStore.use.setIsSecondMenuOpen();
  const { sidebar } = useProjectStore((s) => s);

  const showSidebar = !!(sidebar.first || sidebar.middle || sidebar.last);

  return (
    <>
      <Column
        as="header"
        position="fixed"
        fillWidth
        zIndex={10}
        className="!bg-secondary h-24 dark:!bg-(--neutral-background-weak) flex ml:!hidden"
      >
        <Row fillWidth vertical="center" height="56" paddingX="8" borderBottom="neutral-medium">
          <Row gap="4" vertical="center">
            <Logo
              icon={false}
              size="l"
              className="is-only-dark"
              wordmarkSrc="/trademark/nuvix-logo-dark.svg"
            />
            <Logo
              icon={false}
              size="l"
              className="is-only-light"
              wordmarkSrc="/trademark/nuvix-logo-light.svg"
            />{" "}
          </Row>
          <Row fillWidth vertical="center" horizontal="end">
            <Row as="nav">
              <UserProfile avatarProps={{ size: "s" }} />
              <NavIcon isActive={isDrawerOpen} onClick={() => setIsDrawerOpen(!isDrawerOpen)} />
            </Row>
          </Row>
        </Row>

        <Row fillWidth vertical="center" height="48" paddingX="8">
          <Row gap="4" vertical="center" fillHeight>
            <NavIcon
              hidden={!showSidebar}
              isActive={isSecondMenuOpen}
              onClick={() => setIsSecondMenuOpen(!isSecondMenuOpen)}
            />
            <HeaderOrganization size="s" />
            <HeaderProject size="s" />
          </Row>
        </Row>
      </Column>

      <DrawerRoot open={isDrawerOpen} onOpenChange={(e) => setIsDrawerOpen(e.open)}>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerBody className="!p-0">
            <FirstSidebar inMobile onClose={() => setIsDrawerOpen(false)} />
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
            <SecondSidebar inMobile onClose={() => setIsSecondMenuOpen(false)} />
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};
