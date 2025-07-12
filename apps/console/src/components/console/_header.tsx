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
import { HeaderOrganization, HeaderProject } from "../project/components";
import { UserProfile } from "../_profile";
import { useAppStore } from "@/lib/store";
import { ConsoleSidebar } from "@/ui/layout/ConsoleSidebar";

const ConsoleHeader: React.FC = () => {
  return (
    <>
      <DesktopHeader />
      <MobileHeader />
    </>
  );
};

ConsoleHeader.displayName = "Header";

export { ConsoleHeader };

const DesktopHeader = () => {
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
          className="absolute left-0 -z-1 hidden md:block"
          background="surface"
          width={14}
          height={"64"}
          as={"span"}
        />
        <Row marginLeft="8" marginRight="16">
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
          />
        </Row>
        <Row fillWidth vertical="center" horizontal="space-between" marginLeft={"80"}>
          <Row vertical="center" gap={"8"}>
            <HeaderOrganization />
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
        position="fixed"
        fillWidth
        zIndex={10}
        className="!bg-secondary h-24 dark:!bg-(--neutral-background-weak)"
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
              <Row>
                <NavIcon isActive={isDrawerOpen} onClick={() => setIsDrawerOpen(!isDrawerOpen)} />
              </Row>
            </Row>
          </Row>
        </Row>

        <Row fillWidth vertical="center" height="48" paddingX="8">
          <Row gap="4" vertical="center" fillHeight>
            <HeaderOrganization size="s" />
          </Row>
          <Row fillWidth vertical="center" horizontal="end" fillHeight>
            <UserProfile avatarProps={{ size: "s" }} />
          </Row>
        </Row>
      </Column>

      <DrawerRoot open={isDrawerOpen} onOpenChange={(e) => setIsDrawerOpen(e.open)}>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerBody className="!p-0">
            <ConsoleSidebar inMobile onClose={() => setIsDrawerOpen(false)} />
          </DrawerBody>
          <DrawerCloseTrigger top={1} right={1} />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};
