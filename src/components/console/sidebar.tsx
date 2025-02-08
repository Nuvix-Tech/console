"use client";
import "@/ui/modules/layout/sidebar.scss";
import { Column, Icon, IconButton, Line, Row, Text, ToggleButton } from "@/ui/components";
import { usePathname } from "next/navigation";
import React from "react";
import { useProject } from "@/hooks/useProject";

interface ProjectSidebarProps {
  data: ProjectSidebarData[];
}

export interface ProjectSidebarData {
  name: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  children?: ProjectSidebarData[];
}

const ProjectSidebar: React.FC = () => {
  const [showFullSidebar, setShowFullSidebar] = React.useState(false);
  const pathname = usePathname() ?? "";
  const { project, sideLinks } = useProject();

  const id = project?.$id;

  const sideNav: ProjectSidebarData[] = [
    {
      name: "Overview",
      href: `/console/project/${id}`,
      icon: <span className="icon-chart-bar" />,
    },
    {
      name: "Authentication",
      href: `/console/project/${id}/authentication/users`,
      icon: <span className="icon-users" />,
    },
    {
      name: "Database",
      href: `/console/project/${id}/database`,
      icon: <span className="icon-database" />,
    },
    {
      name: "Storage",
      href: `/console/project/${id}/storage`,
      icon: <span className="icon-folder" />,
    },
    {
      name: "Functions",
      href: `/console/project/${id}/functions`,
      icon: <span className="icon-code" />,
    },
    {
      name: "Messaging",
      href: `/console/project/${id}/messaging`,
      icon: <span className="icon-chat-alt-2" />,
    },
  ];

  const onThemeChange = (theme: string) => {
    const body = document.body;
    const html = document.documentElement;

    if (body) {
      body.classList.forEach((className) => {
        if (className.startsWith("theme-")) {
          body.classList.remove(className);
        }
      });
      body.classList.add(`theme-${theme}`);
    }

    if (html) {
      html.setAttribute("data-theme", theme);
      html.style.colorScheme = theme;
      html.classList.forEach((className) => {
        if (className.startsWith("theme-")) {
          html.classList.remove(className);
        }
      });
      html.classList.add(`theme-${theme}`);
    }
  };

  return (
    <>
      <Row className="sidebar">
        <Row gap="0" fill position="relative">
          <Column
            maxWidth={showFullSidebar ? 14 : 4}
            fill
            paddingY="32"
            position="absolute"
            vertical="space-between"
            border="neutral-medium"
            style={{
              borderWidth: 0,
              borderRightWidth: 1,
            }}
            zIndex={10}
            className={`sidebar-small ${showFullSidebar ? "sidebar-small-open" : ""}`}
            background="surface"
            onMouseEnter={() => setShowFullSidebar(true)}
            onMouseLeave={() => setShowFullSidebar(false)}
          >
            <Column fillWidth paddingX="xs" gap="m">
              {sideNav.map((item, index) => (
                <SidebarSmallButton
                  key={index}
                  item={item}
                  showFullSidebar={showFullSidebar}
                  selected={pathname === item.href}
                />
              ))}
            </Column>

            <Column fillWidth paddingX="xs" gap="s">
              <Line />

              <SidebarSmallButton
                item={{
                  name: "Settings",
                  href: `/console/project/${id}/settings`,
                  icon: <span className="icon-cog" />,
                }}
                showFullSidebar={showFullSidebar}
                selected={pathname === `/console/project/${id}/settings`}
              />

              <SidebarSmallButton
                item={{
                  name: "Appearance",
                  onClick: () => {
                    const currentTheme =
                      document.documentElement.getAttribute("data-theme") || "light";
                    const newTheme = currentTheme === "light" ? "dark" : "light";
                    onThemeChange(newTheme);
                  },
                  icon: <span className="icon-sun" />,
                }}
                showFullSidebar={showFullSidebar}
              />
            </Column>
          </Column>

          {sideLinks?.length ? (
            <Column
              fillHeight
              fillWidth
              paddingX="16"
              paddingY="32"
              marginLeft={"64"}
              gap="m"
              position="relative"
              background="page"
              border="neutral-weak"
              style={{
                borderWidth: 0,
                borderRightWidth: 1,
              }}
              className="sidebar-large"
            >
              <Column fill paddingX="xs" gap="m">
                <Column gap="4">
                  <ToggleButton fillWidth justifyContent="flex-start" selected={false}>
                    <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
                      <span className="icon-chart-bar" aria-hidden="true"></span>
                      Overview
                    </Row>
                  </ToggleButton>

                  <Row
                    fillWidth
                    horizontal="space-between"
                    vertical="center"
                    paddingY="8"
                    paddingX="16"
                  >
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Projects
                    </Text>
                    <IconButton tooltip="Create" variant="secondary" icon="plus" size="s" />
                  </Row>
                  <ToggleButton
                    fillWidth
                    justifyContent="flex-start"
                    selected={pathname === "projects"}
                  >
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
                  <ToggleButton
                    fillWidth
                    justifyContent="flex-start"
                    selected={pathname === "analytics"}
                  >
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
                  <ToggleButton
                    fillWidth
                    justifyContent="flex-start"
                    selected={pathname === "analytics"}
                  >
                    <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
                      API Reference
                    </Row>
                  </ToggleButton>
                </Column>

                <Line />

                <Column fillWidth gap="4">
                  <ToggleButton
                    fillWidth
                    justifyContent="flex-start"
                    selected={pathname === "permissions"}
                  >
                    <Row padding="4" gap="12" vertical="center" textVariant="label-default-s">
                      Logout
                    </Row>
                  </ToggleButton>
                </Column>
                <Line />
              </Column>
            </Column>
          ) : null}
        </Row>
      </Row>
    </>
  );
};

const SidebarSmallButton = ({
  item,
  showFullSidebar,
  selected,
}: { item: ProjectSidebarData; showFullSidebar: boolean; selected?: boolean }) => {
  return (
    <ToggleButton
      size="l"
      fillWidth
      href={item.href}
      justifyContent={showFullSidebar ? "flex-start" : "center"}
      selected={selected ?? false}
      onClick={item.onClick}
      disabled={item.disabled}
    >
      <Row padding="4" vertical="center" gap="12" textVariant="label-default-l">
        {item.icon}
        {showFullSidebar && <span>{item.name}</span>}
      </Row>
    </ToggleButton>
  );
};

ProjectSidebar.displayName = "Sidebar";
export { ProjectSidebar };
