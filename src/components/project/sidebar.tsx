"use client";
import "@/ui/modules/layout/sidebar.scss";
import { Column, Line, RevealFx, Row, ToggleButton } from "@/ui/components";
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
  return (
    <>
      <Row className="sidebar">
        <Row gap="0" fill position="relative">
          <FirstSidebar />
          <SecondSidebar />
        </Row>
      </Row>
    </>
  );
};

interface FirstSidebarProps {
  alwaysFull?: boolean;
  noBg?: boolean;
  border?: boolean;
}

export const FirstSidebar = ({ alwaysFull, noBg, border = true }: FirstSidebarProps) => {
  const [showFullSidebar, setShowFullSidebar] = React.useState(false);
  const pathname = usePathname() ?? "";
  const { project } = getProjectState();
  const { setColorMode } = useColorMode();

  const id = project?.$id;

  const sideNav: SidebarItem[] = [
    {
      name: "Overview",
      href: `/console/project/${id}`,
      icon: <span className="icon-chart-bar" />,
      active: pathname === `/console/project/${id}`,
    },
    {
      name: "Authentication",
      href: `/console/project/${id}/authentication/users`,
      active: pathname.includes(`/console/project/${id}/authentication`),
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
    setColorMode(theme);
  };

  return (
    <>
      <Column
        maxWidth={alwaysFull ? undefined : showFullSidebar ? 14 : 4}
        fill
        paddingY="32"
        position={alwaysFull ? "relative" : "absolute"}
        vertical="space-between"
        overflowX="hidden"
        border={"neutral-medium"}
        style={{
          borderWidth: 0,
          borderRightWidth: border ? 1 : 0,
        }}
        zIndex={10}
        className={`sidebar-small ${showFullSidebar ? "sidebar-small-open" : ""}`}
        background={noBg ? "transparent" : "surface"}
        onMouseEnter={() => setShowFullSidebar(true)}
        onMouseLeave={() => setShowFullSidebar(false)}
      >
        <Column fillWidth paddingX="xs" gap="m">
          {sideNav.map((item, index) => (
            <SidebarSmallButton
              key={index}
              item={item}
              showFullSidebar={showFullSidebar || !!alwaysFull}
              selected={item.active ?? pathname.includes(item.href ?? "")}
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
            showFullSidebar={showFullSidebar || !!alwaysFull}
            selected={pathname === `/console/project/${id}/settings`}
          />

          <SidebarSmallButton
            item={{
              name: "Appearance",
              onClick: () => {
                const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
                const newTheme = currentTheme === "light" ? "dark" : "light";
                onThemeChange(newTheme);
              },
              icon: <span className="icon-sun" />,
            }}
            showFullSidebar={showFullSidebar || !!alwaysFull}
          />
        </Column>
      </Column>
    </>
  );
};

interface SecondSidebarProps {
  noMarg?: boolean;
  noBg?: boolean;
  border?: boolean;
}

export const SecondSidebar = ({ noMarg, noBg, border = true }: SecondSidebarProps) => {
  const { sidebar } = getProjectState();

  return (
    <>
      {sidebar.first || sidebar.middle || sidebar.last ? (
        <Column
          fillWidth
          paddingY="12"
          marginLeft={noMarg ? "0" : "64"}
          gap="m"
          position="relative"
          background={noBg ? "transparent" : "page"}
          border="neutral-medium"
          overflowX="hidden"
          overflowY="auto"
          style={{
            borderWidth: 0,
            borderRightWidth: border ? 1 : 0,
          }}
          className="sidebar-large"
        >
          <Column fillWidth gap="s" paddingBottom="56">
            <RevealFx direction="column" fillWidth gap="s" horizontal="start" trigger>
              {sidebar.first}
            </RevealFx>
            {sidebar.middle}
            {sidebar.last}
          </Column>
        </Column>
      ) : null}
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
