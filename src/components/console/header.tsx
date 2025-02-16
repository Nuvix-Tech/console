"use client";

import { sdkForConsole } from "@/lib/sdk";
import { ConsoleContext } from "@/lib/store/console";
import { Badge, Column, Logo, NavIcon, Option, Row, ToggleButton, UserMenu } from "@/ui/components";
import { usePathname } from "next/navigation";
import type React from "react";
import { useContext } from "react";
import { ColorModeButton } from "../ui/color-mode";
import { Avatar, HStack, Stack, Text } from "@chakra-ui/react";
import { appState, getAppState } from "@/state/app-state";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FirstSidebar, SecondSidebar } from "./sidebar";

interface HeaderProps {
  authenticated?: boolean;
  avatar?: string;
  name?: string;
  subline?: string;
}

const ConsoleHeader: React.FC<HeaderProps> = () => {
  const { organization, isDrawerOpen, isSecondMenuOpen } = getAppState();
  const { data } = useContext(ConsoleContext);
  const { avatars } = sdkForConsole;
  const pathname = usePathname() ?? "";
  const user = data.user;

  return (
    <>
      <Row
        hide="s"
        as="header"
        borderBottom="neutral-medium"
        fillWidth
        position="fixed"
        zIndex={10}
        paddingX="m"
        height="64"
        vertical="center"
        background="surface"
      >
        <Row>
          <div className="is-only-dark">
            <Logo icon={false} size="s" wordmarkSrc="/trademark/nuvix-logo-dark.svg" />
          </div>
          <div className="is-only-light">
            <Logo icon={false} size="s" wordmarkSrc="/trademark/nuvix-logo-light.svg" />
          </div>
        </Row>
        <Badge effect arrow={false}>
          DEV
        </Badge>
        <Row fillWidth vertical="center" horizontal="space-between">
          <Row fillWidth>
            <Row fillWidth gap="4" paddingX="l" vertical="center">
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
                <NavIcon
                  isActive={isDrawerOpen}
                  onClick={() => (appState.isDrawerOpen = !appState.isDrawerOpen)}
                />
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
              onClick={() => (appState.isSecondMenuOpen = !appState.isSecondMenuOpen)}
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

      <DrawerRoot open={isDrawerOpen} onOpenChange={(e) => (appState.isDrawerOpen = e.open)}>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerBody>
            <FirstSidebar alwaysFull noBg border={false} />
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>

      <DrawerRoot
        open={isSecondMenuOpen}
        onOpenChange={(e) => (appState.isSecondMenuOpen = e.open)}
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

ConsoleHeader.displayName = "Header";
export { ConsoleHeader };
