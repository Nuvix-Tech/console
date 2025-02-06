"use client";

import { Column, Icon, IconButton, Line, Row, Tag, Text, ToggleButton } from "@/ui/components";
import { usePathname } from "next/navigation";
import { GoArrowUpRight } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";

const ConsoleSidebar: React.FC = ({}) => {
  const pathname = usePathname() ?? "";

  return (
    <Column
      maxWidth={16}
      fillHeight
      paddingX="16"
      paddingY="32"
      gap="m"
      background="page"
      border="neutral-weak"
    >
      <Column fill paddingX="xs" gap="m">
        <Column gap="4">
          <Row fillWidth horizontal="space-between" vertical="center" paddingY="8" paddingX="16">
            <Text variant="body-default-xs" onBackground="neutral-weak">
              Projects
            </Text>
            <IconButton tooltip="Create" variant="secondary" icon="plus" size="s" />
          </Row>
          <ToggleButton fillWidth justifyContent="flex-start" selected={pathname === "projects"}>
            <Row padding="4" gap="12" vertical="center" textVariant="label-default-s">
              <Line width="16" />
              All Projects
            </Row>
          </ToggleButton>
        </Column>

        <Line />

        <Column fillWidth gap="4">
          <Text
            variant="body-default-xs"
            onBackground="neutral-weak"
            marginBottom="8"
            marginLeft="16"
          >
            Account
          </Text>
          <ToggleButton fillWidth justifyContent="flex-start" selected={false}>
            <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
              <Icon name="PiHouseDuotone" onBackground="neutral-weak" size="xs" />
              Preferences
            </Row>
          </ToggleButton>
          <ToggleButton fillWidth justifyContent="flex-start" selected={pathname === "analytics"}>
            <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
              <Icon name="PiTrendUpDuotone" onBackground="neutral-weak" size="xs" />
              Audit Logs
            </Row>
          </ToggleButton>
          {/* <ToggleButton
            style={{
              position: "relative",
            }}
            fillWidth
            justifyContent="flex-start"
            selected={pathname === "reports"}
          >
            <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
              <Icon name="PiNotebookDuotone" onBackground="neutral-weak" size="xs" />
              Reports
              <Tag variant="neutral" size="s" position="absolute" right="8">
                New
              </Tag>
            </Row>
          </ToggleButton> */}
        </Column>

        <Line />

        <Column fillWidth gap="4">
          <Text
            variant="body-default-xs"
            onBackground="neutral-weak"
            marginBottom="8"
            marginLeft="16"
          >
            Documentation
          </Text>
          <ToggleButton fillWidth justifyContent="flex-start" selected={false}>
            <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
              <Icon name={GoArrowUpRight} onBackground="neutral-weak" size="xs" />
              Guides
            </Row>
          </ToggleButton>
          <ToggleButton fillWidth justifyContent="flex-start" selected={pathname === "analytics"}>
            <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
              <Icon name={GoArrowUpRight} onBackground="neutral-weak" size="xs" />
              API Reference
            </Row>
          </ToggleButton>
          {/* <ToggleButton
            style={{
              position: "relative",
            }}
            fillWidth
            justifyContent="flex-start"
            selected={pathname === "reports"}
          >
            <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
              <Icon name="PiNotebookDuotone" onBackground="neutral-weak" size="xs" />
              Reports
              <Tag variant="neutral" size="s" position="absolute" right="8">
                New
              </Tag>
            </Row>
          </ToggleButton> */}
        </Column>

        <Line />

        <Column fillWidth gap="4">
          <ToggleButton fillWidth justifyContent="flex-start" selected={pathname === "permissions"}>
            <Row padding="4" gap="12" vertical="center" textVariant="label-default-s">
              <Icon name={IoLogOutOutline} onBackground="neutral-weak" size="xs" />
              Logout
            </Row>
          </ToggleButton>
        </Column>

        <Line />
      </Column>
    </Column>
  );
};

ConsoleSidebar.displayName = "Sidebar";
export { ConsoleSidebar };
