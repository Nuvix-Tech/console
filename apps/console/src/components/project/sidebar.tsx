"use client";
import {
  Column,
  Icon,
  IconProps,
  Line,
  RevealFx,
  Row,
  Text,
  ToggleButton,
} from "@nuvix/ui/components";
import { useParams, usePathname } from "next/navigation";
import * as React from "react";
import { useProjectStore } from "@/lib/store";
import { ResizablePanel } from "@nuvix/sui/components/resizable";
import { useSidebarHref } from "@/hooks/useSidebarHref";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";

export interface ProjectSidebarData {
  name: string;
  href?: string;
  onClick?: () => void;
  icon?: IconProps["name"];
  active?: boolean;
  disabled?: boolean;
  children?: ProjectSidebarData[];
}

export interface SidebarItem {
  name: string;
  active?: boolean;
  disabled?: boolean;
  href?: string;
  icon?: IconProps["name"];
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
      <FirstSidebar />
      {showSubSidebar ? (
        <ResizablePanel minSize={16} maxSize={25} className="hidden md:flex">
          <SecondSidebar />
        </ResizablePanel>
      ) : (
        <span className="w-4" />
      )}
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
  const { id } = useParams();

  const { href, isEqual, isIncludes } = useSidebarHref();

  const sideNav: SidebarItem[] = [
    {
      name: "Overview",
      href: href(),
      icon: "house",
      active: isEqual(),
    },
    {
      name: "Authentication",
      href: href(`authentication/users`),
      active: isIncludes("authentication"),
      icon: "authentication",
    },
    {
      name: "Collections",
      href: href(`schema`),
      icon: "refresh",
    },
    {
      name: "Database",
      href: href(`database/schemas`),
      icon: "database",
      active: isIncludes("database"),
    },
    {
      name: "Storage",
      href: href(`buckets`),
      icon: "storage",
      active: isIncludes("buckets"),
    },
    {
      name: "Table Editor",
      href: href(`editor`),
      icon: "tableEditor",
      active: isIncludes("editor"),
    },
    {
      name: "SQL Editor",
      href: href(`sql/new`),
      icon: "runner",
    },
    {
      name: "Functions",
      href: href(`functions`),
      icon: "functions",
      active: isIncludes("functions"),
    },
    {
      name: "Messaging",
      href: href(`messaging`),
      icon: "messaging",
      active: isIncludes("messaging"),
    },
  ];

  const showSubSidebar = true; // sidebar.first || sidebar.middle || sidebar.last;

  return (
    <>
      <Column
        maxWidth={alwaysFull ? undefined : 4}
        fill
        paddingBottom="12"
        vertical="space-between"
        overflowX="hidden"
        position="relative"
        overflowY="auto"
        className="transition-[max-width] duration-200 ease-in-out no-scrollbar"
        background={noBg ? "transparent" : "surface"}
      >
        <Column fillWidth paddingX="xs" gap="xs">
          {sideNav.map((item, index) => (
            <SidebarSmallButton
              key={index}
              item={item}
              showFullSidebar={!showSubSidebar || !!alwaysFull}
              selected={item.active ?? pathname.includes(item.href ?? "")}
            />
          ))}
        </Column>

        <Column fillWidth paddingX="xs" gap="xs">
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

export const SecondSidebar = ({ noMarg, noBg = true, border = true }: SecondSidebarProps) => {
  const sidebar = useProjectStore.use.sidebar();

  return sidebar.first || sidebar.middle || sidebar.last ? (
    <Column fillWidth>
      {sidebar.title && (
        <Row
          paddingY="8"
          paddingX="12"
          marginX="8"
          marginBottom="8"
          marginTop="0"
          radius="l"
          className="bg-[var(--main-background)]"
        >
          <Text variant="label-strong-m">{sidebar.title}</Text>
        </Row>
      )}
      <Column
        gap="m"
        position="relative"
        background={noBg ? "transparent" : "surface"}
        overflowX="hidden"
        overflowY="auto"
      >
        <Column fill gap="s">
          {sidebar.first && (
            <RevealFx
              direction="column"
              fillWidth
              flex={!(sidebar.middle || sidebar.last) ? "1" : undefined}
              gap="s"
              horizontal="start"
              trigger
              speed="fast"
            >
              {sidebar.first}
            </RevealFx>
          )}
          {sidebar.middle && (
            <RevealFx direction="column" fillWidth gap="s" horizontal="start" trigger speed="fast">
              {sidebar.middle}
            </RevealFx>
          )}
          {sidebar.last && (
            <RevealFx direction="column" fillWidth gap="s" horizontal="start" trigger speed="fast">
              {sidebar.last}
            </RevealFx>
          )}
        </Column>
      </Column>
    </Column>
  ) : null;
};

const SidebarSmallButton = ({
  item,
  showFullSidebar,
  selected,
}: { item: ProjectSidebarData; showFullSidebar: boolean; selected?: boolean }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <ToggleButton
          size="l"
          fillWidth
          href={item.href}
          justifyContent={showFullSidebar ? "flex-start" : "center"}
          selected={selected ?? false}
          onClick={item.onClick}
          disabled={item.disabled}
        >
          <Icon name={item.icon} />
        </ToggleButton>
      </TooltipTrigger>
      <TooltipContent side="right">{item.name}</TooltipContent>
    </Tooltip>
  );
};

ProjectSidebar.displayName = "Sidebar";
export { ProjectSidebar };
