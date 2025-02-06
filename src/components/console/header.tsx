"use client";

import { sdkForConsole } from "@/lib/sdk";
import { ConsoleContext } from "@/lib/store/console";
import {
  Badge,
  Button,
  Column,
  Flex,
  Line,
  Logo,
  NavIcon,
  Option,
  Row,
  SmartLink,
  ToggleButton,
  UserMenu,
} from "@/ui/components";
import { usePathname } from "next/navigation";
import type React from "react";
import { useContext } from "react";

interface HeaderProps {
  authenticated?: boolean;
  avatar?: string;
  name?: string;
  subline?: string;
}

const ConsoleHeader: React.FC<HeaderProps> = () => {
  const { data } = useContext(ConsoleContext);
  const { avatars } = sdkForConsole;
  const pathname = usePathname() ?? "";
  const user = data.user;

  return (
    <Row
      as="header"
      borderBottom="neutral-medium"
      fillWidth
      paddingX="m"
      height="64"
      vertical="center"
      background="surface"
    >
      <Row hide="s">
        <Logo icon={false} size="s" wordmarkSrc="/trademark/nuvix-logo-dark.svg" />
      </Row>
      <Row show="s" gap="4" vertical="center">
        <NavIcon />
        <Logo wordmark={false} iconSrc="/trademark/nuvix.svg" />
      </Row>
      <Badge hide="s" effect arrow={false}>
        DEV
      </Badge>
      <Row fillWidth vertical="center" horizontal="space-between">
        <Row fillWidth>
          <Row hide="s" fillWidth gap="4" paddingX="l" vertical="center">
            <ToggleButton selected={pathname === "/apps"} label="Support" />
            <ToggleButton selected={pathname === "/resources"} label="Feedback" />
          </Row>
        </Row>
        <Row as="nav">
          <Row hide="s" minWidth={12}>
            <UserMenu
              name={user?.name}
              subline={"HELLO ORG"}
              avatarProps={{
                src: avatars.getInitials(user?.name, 96, 96),
              }}
              dropdown={
                <Column padding="2" gap="2" minWidth={8}>
                  <Option label="Profile" value="profile" />
                  <Option label="Settings" value="settings" />
                  <Line />
                  <Option label="Log out" value="logout" />
                </Column>
              }
            />
          </Row>
          <Row show="s">
            <UserMenu
              avatarProps={{
                src: avatars.getInitials(),
              }}
              dropdown={
                <>
                  <Option label="Profile" value="profile" />
                  <Option label="Settings" value="settings" />
                  <Option label="Log out" value="logout" />
                </>
              }
            />
          </Row>
        </Row>
      </Row>
    </Row>
  );
};

ConsoleHeader.displayName = "Header";
export { ConsoleHeader };
