"use client";
import "@/ui/modules/layout/sidebar.scss";
import { Column, Line, Row, ToggleButton } from "@/ui/components";
import { usePathname } from "next/navigation";
import { getProjectState } from "@/state/project-state";
import * as React from "react";
import { useColorMode } from "../ui/color-mode";

export interface ProjectSidebarData {
  name: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  children?: ProjectSidebarData[];
}

export interface SidebarItem {
  name: string;
  active?: boolean;
  disabled?: boolean;
  href?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  badge?: React.ReactNode;
}

export interface SidebarItemGroup {
  title: string;
  items: SidebarItem[];
}

const ProjectSidebar: React.FC = () => {
  const [showFullSidebar, setShowFullSidebar] = React.useState(false);
  const pathname = usePathname() ?? "";
  const { project, sidebar } = getProjectState();
  const { setColorMode } = useColorMode();

  const id = project?.$id;

  const sideNav: SidebarItem[] = [
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
      icon: <span className="icon-sparkles" />,
    },
    {
      name: "Messaging",
      href: `/console/project/${id}/messaging`,
      icon: <span className="icon-chat-alt-2" />,
    },
  ];

  const onThemeChange = (theme: "light" | "dark") => {
    const html = document.documentElement;
    if (html) {
      html.setAttribute("data-theme", theme);
      html.style.colorScheme = theme;
      setColorMode(theme);
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
            overflowX="hidden"
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

          {sidebar.first || sidebar.middle || sidebar.last ? (
            <Column
              fillHeight
              fillWidth
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
              <Column fill gap="m">
                {sidebar.first}
                {sidebar.middle}
                {sidebar.last}
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
