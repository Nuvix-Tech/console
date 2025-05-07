"use client";
import { Column, Line, RevealFx, Row, ToggleButton } from "@nuvix/ui/components";
import { useParams, usePathname } from "next/navigation";
import * as React from "react";
import { useColorMode } from "../cui/color-mode";
import { useProjectStore } from "@/lib/store";
import { Stack } from "@chakra-ui/react";
import { cn } from "@nuvix/sui/lib/utils";
import { ResizablePanel } from "@nuvix/sui/components/resizable";

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
  const sidebar = useProjectStore.use.sidebar();
  const showSubSidebar = sidebar.first || sidebar.middle || sidebar.last;

  return (
    <>
      {/* <Stack
        position="relative"
        as={"aside"}
        className={cn("lg:flex hidden", {
          // "lg:w-[17.5rem]": showSubSidebar,
          // "lg:w-[15.5rem]": !showSubSidebar,
        })}
        height="full"
      > */}
      <ResizablePanel
        minSize={showSubSidebar ? 23 : 18}
        maxSize={showSubSidebar ? 35 : 20}
        className="hidden lg:flex"
      >
        <Row gap="4" fill position="relative">
          <FirstSidebar />
          <SecondSidebar />
        </Row>
      </ResizablePanel>
      {/* </Stack> */}
    </>
  );
};

interface FirstSidebarProps {
  alwaysFull?: boolean;
  noBg?: boolean;
  border?: boolean;
}

export const FirstSidebar = ({ alwaysFull, noBg, border = true }: FirstSidebarProps) => {
  const pathname = usePathname() ?? "";
  const sidebar = useProjectStore.use.sidebar();
  const { setColorMode } = useColorMode();
  const { id } = useParams();

  const sideNav: SidebarItem[] = [
    {
      name: "Overview",
      href: `/project/${id}`,
      icon: <span className="icon-chart-bar" />,
      active: pathname === `/project/${id}`,
    },
    {
      name: "Authentication",
      href: `/project/${id}/authentication/users`,
      active: pathname.includes(`/project/${id}/authentication`),
      icon: <span className="icon-users" />,
    },
    {
      name: "Collections",
      href: `/project/${id}/d-schema`,
      icon: <span className="icon-collection" />,
    },
    {
      name: "Database",
      href: `/project/${id}/database/schemas`,
      icon: <span className="icon-database" />,
    },
    {
      name: "Storage",
      href: `/project/${id}/buckets`,
      icon: <span className="icon-folder" />,
    },
    {
      name: "Table Editor",
      href: `/project/${id}/editor`,
      icon: <span className="icon-table" />,
    },
    {
      name: "Functions",
      href: `/project/${id}/functions`,
      icon: <span className="icon-sparkles" />,
    },
    {
      name: "Messaging",
      href: `/project/${id}/messaging`,
      icon: <span className="icon-chat-alt-2" />,
    },
  ];

  const onThemeChange = (theme: "light" | "dark") => {
    setColorMode(theme);
  };

  const showSubSidebar = sidebar.first || sidebar.middle || sidebar.last;

  return (
    <>
      <Column
        maxWidth={alwaysFull ? undefined : !showSubSidebar ? undefined : 4}
        fill
        paddingBottom="32"
        paddingTop="12"
        // position={alwaysFull ? "relative" : "absolute"}
        vertical="space-between"
        overflowX="hidden"
        border={"surface"}
        style={
          {
            // borderWidth: 0,
            // borderRightWidth: border ? 1 : 0,
          }
        }
        radius="l"
        zIndex={10}
        overflowY="auto"
        className="transition-[max-width] duration-200 ease-in-out"
        background={noBg ? "transparent" : "surface"}
      >
        <Column fillWidth paddingX="xs" gap="m">
          {sideNav.map((item, index) => (
            <SidebarSmallButton
              key={index}
              item={item}
              showFullSidebar={!showSubSidebar || !!alwaysFull}
              selected={item.active ?? pathname.includes(item.href ?? "")}
            />
          ))}
        </Column>

        <Column fillWidth paddingX="xs" gap="s">
          <Line />

          <SidebarSmallButton
            item={{
              name: "Settings",
              href: `/project/${id}/s/general`,
              icon: <span className="icon-cog" />,
            }}
            showFullSidebar={!showSubSidebar || !!alwaysFull}
            selected={pathname === `/project/${id}/settings`}
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
            showFullSidebar={!showSubSidebar || !!alwaysFull}
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
  const sidebar = useProjectStore.use.sidebar();

  return (
    <>
      {sidebar.first || sidebar.middle || sidebar.last ? (
        <Column
          fillWidth
          paddingY="12"
          // marginLeft={noMarg ? "0" : "64"}
          gap="m"
          position="relative"
          background={noBg ? "transparent" : "surface"}
          border="surface"
          overflowX="hidden"
          overflowY="auto"
          style={
            {
              // borderWidth: 0,
              // borderRightWidth: border ? 1 : 0,
            }
          }
          radius="l"
        >
          <Column fill gap="s">
            {sidebar.first && (
              <RevealFx
                direction="column"
                fillWidth
                flex={"1"}
                gap="s"
                horizontal="start"
                trigger
                speed="fast"
              >
                {sidebar.first}
              </RevealFx>
            )}
            {sidebar.middle && (
              <RevealFx
                direction="column"
                fillWidth
                gap="s"
                horizontal="start"
                trigger
                speed="fast"
              >
                {sidebar.middle}
              </RevealFx>
            )}
            {sidebar.last && (
              <RevealFx
                direction="column"
                fillWidth
                gap="s"
                horizontal="start"
                trigger
                speed="fast"
              >
                {sidebar.last}
              </RevealFx>
            )}
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
