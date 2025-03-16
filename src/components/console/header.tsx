"use client";

import { sdkForConsole } from "@/lib/sdk";
import { Badge, Column, Logo, NavIcon, Row } from "@/ui/components";
import { usePathname } from "next/navigation";
import type React from "react";
import { useRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import Link from "next/link";
import { Button } from "../ui/button";
import { UserProfile } from "../_profile";
import { Stack } from "@chakra-ui/react";
import { ConsoleSidebar } from "@/ui/modules/layout/ConsoleSidebar";
import { useAppStore } from "@/lib/store";

interface HeaderProps {
  authenticated?: boolean;
  avatar?: string;
  name?: string;
  subline?: string;
}

const ConsoleHeader: React.FC<HeaderProps> = () => {
  const organization = useAppStore.use.organization?.();
  const isDrawerOpen = useAppStore.use.isDrawerOpen();
  const setIsDrawerOpen = useAppStore.use.setIsDrawerOpen();
  const pathname = usePathname() ?? "";
  const headerRef = useRef<any>(null);

  return (
    <>
      <Row
        as="header"
        fillWidth
        radius="l"
        gap="12"
        paddingX="m"
        height="64"
        vertical="center"
        background="surface"
        ref={headerRef}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" width="full">
          <Row gap="4" vertical="center">
            <Row show="s">
              <NavIcon isActive={isDrawerOpen} onClick={() => setIsDrawerOpen(!isDrawerOpen)} />
            </Row>
            <Link href="/">
              <div className="is-only-dark">
                <Logo icon={false} size="m" wordmarkSrc="/trademark/nuvix-logo-dark.svg" />
              </div>
              <div className="is-only-light">
                <Logo icon={false} size="m" wordmarkSrc="/trademark/nuvix-logo-light.svg" />
              </div>
            </Link>
          </Row>

          <Row fillWidth vertical="center" horizontal="space-between">
            <Row fillWidth vertical="center" horizontal="end" gap="12">
              <div className="flex items-center gap-3">
                <Button variant="outline" className="hidden sm:flex">
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
        </Stack>
      </Row>

      <Drawer open={isDrawerOpen} onOpenChange={(open) => setIsDrawerOpen(open)}>
        <DrawerContent>
          <ConsoleSidebar inMobile />
        </DrawerContent>
      </Drawer>
    </>
  );
};

ConsoleHeader.displayName = "Header";

export { ConsoleHeader };
