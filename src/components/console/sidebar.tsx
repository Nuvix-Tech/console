"use client";
import '@/ui/modules/layout/sidebar.scss';
import { Column, Icon, IconButton, Line, Row, Text, ToggleButton } from "@/ui/components";
import { usePathname } from "next/navigation";
import React from "react";


interface ProjectSidebarProps {
  data: ProjectSidebarData[];
}

interface ProjectSidebarData {
  name: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  children?: ProjectSidebarData[];
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ data }) => {
  const [showFullSidebar, setShowFullSidebar] = React.useState(false);
  const pathname = usePathname() ?? "";

  return (
    <>
      <Row fillHeight position='fixed' zIndex={2} width={28} top='56'>
        <Row gap='0' fillHeight position='relative' >
          <Column
            maxWidth={showFullSidebar ? 12 : 4}
            fill
            paddingY="32"
            position="absolute"
            border="neutral-medium"
            style={{
              borderWidth: 0,
              borderRightWidth: 1,
            }}
            zIndex={10}
            className="sidebar"
            background='surface'
            onMouseEnter={() => setShowFullSidebar(true)}
            onMouseLeave={() => setShowFullSidebar(false)}
          >
            <Column fill paddingX="xs" gap="m">
              {data.map((item, index) => (
                <ToggleButton
                  key={index}
                  size="l"
                  fillWidth
                  justifyContent="flex-start"
                  selected={pathname === item.href}
                  onClick={item.onClick}
                  disabled={item.disabled}
                >
                  <Row padding="4" vertical="center" gap="12" textVariant="label-default-l">
                    {item.icon}
                    {showFullSidebar && <span>{item.name}</span>}
                  </Row>
                </ToggleButton>
              ))}
            </Column>
          </Column>

          <Column
            fillHeight
            fillWidth
            paddingX="16"
            paddingY="32"
            marginLeft={'64'}
            gap="m"
            position="relative"
            background="page"
            border="neutral-weak"
          >
            <Column fill paddingX="xs" gap="m">
              <Column gap="4">
                <ToggleButton fillWidth justifyContent="flex-start" selected={false}>
                  <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
                    <span className="icon-chart-bar" aria-hidden="true"></span>
                    Overview
                  </Row>
                </ToggleButton>

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
                    Guides
                  </Row>
                </ToggleButton>
                <ToggleButton fillWidth justifyContent="flex-start" selected={pathname === "analytics"}>
                  <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
                    API Reference
                  </Row>
                </ToggleButton>
              </Column>

              <Line />

              <Column fillWidth gap="4">
                <ToggleButton fillWidth justifyContent="flex-start" selected={pathname === "permissions"}>
                  <Row padding="4" gap="12" vertical="center" textVariant="label-default-s">
                    Logout
                  </Row>
                </ToggleButton>
              </Column>
              <Line />
            </Column>
          </Column>
        </Row>
      </Row>
    </>
  );
};

ProjectSidebar.displayName = "Sidebar";
export { ProjectSidebar };
