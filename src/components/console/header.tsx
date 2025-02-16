"use client";

import { sdkForConsole } from "@/lib/sdk";
import { ConsoleContext } from "@/lib/store/console";
import { Badge, Logo, NavIcon, Row, ToggleButton } from "@/ui/components";
import { usePathname } from "next/navigation";
import type React from "react";
import { useContext, useRef } from "react";
import { Avatar, HStack, Stack, Text } from "@chakra-ui/react";
import { appState, getAppState } from "@/state/app-state";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerRoot,
} from "@/components/ui/drawer";
import { FirstSidebar } from "../project/sidebar";

interface HeaderProps {
  authenticated?: boolean;
  avatar?: string;
  name?: string;
  subline?: string;
}

const ConsoleHeader: React.FC<HeaderProps> = () => {
  const { organization, isDrawerOpen } = getAppState();
  const { data } = useContext(ConsoleContext);
  const { avatars } = sdkForConsole;
  const pathname = usePathname() ?? "";
  const user = data.user;
  const headerRef = useRef<any>(null);

  return (
    <>
      <Row
        as="header"
        borderBottom="neutral-medium"
        fillWidth
        position="fixed"
        zIndex={10}
        gap="12"
        paddingX="m"
        height="64"
        vertical="center"
        background="surface"
        ref={headerRef}
      >
        <Row hide="s">
          <div className="is-only-dark">
            <Logo icon={false} size="s" wordmarkSrc="/trademark/nuvix-logo-dark.svg" />
          </div>
          <div className="is-only-light">
            <Logo icon={false} size="s" wordmarkSrc="/trademark/nuvix-logo-light.svg" />
          </div>
        </Row>
        <Row gap="4" vertical="center" show="s">
          <NavIcon
            isActive={isDrawerOpen}
            onClick={() => (appState.isDrawerOpen = !appState.isDrawerOpen)}
          />
          <Logo wordmark={false} size="l" iconSrc="/trademark/nuvix.svg" />
        </Row>
        <Badge
          effect
          hide="s"
          arrow={false}
          paddingX="16"
          paddingY="4"
          title="DEV"
          horizontal="center"
        />
        <Row fillWidth vertical="center" horizontal="space-between">
          <Row fillWidth>
            <Row fillWidth hide="s" gap="4" paddingX="l" vertical="center">
              <ToggleButton selected={pathname === "/apps"} label="Support" />
              <ToggleButton selected={pathname === "/resources"} label="Feedback" />
            </Row>
          </Row>
          <Row as="nav">
            <Row minWidth={10}>
              <HStack key={user?.email} gap="4">
                <Avatar.Root size={"sm"}>
                  <Avatar.Fallback name={user?.name} />
                  <Avatar.Image src={avatars.getInitials(user?.name, 96, 96)} />
                </Avatar.Root>
                <Stack gap="0">
                  <Text textStyle={"sm"} fontWeight="medium">
                    {user?.name}
                  </Text>
                  <Text color="fg.muted" textStyle="sm">
                    {organization?.name}
                  </Text>
                </Stack>
              </HStack>
            </Row>
          </Row>
        </Row>
      </Row>

      <DrawerRoot open={isDrawerOpen} onOpenChange={(e) => (appState.isDrawerOpen = e.open)}>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerBody>
            <FirstSidebar alwaysFull noBg border={false} />
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

ConsoleHeader.displayName = "Header";

export { ConsoleHeader };
