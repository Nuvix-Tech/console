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
import {
  ImperativePanelHandle,
  ResizablePanel,
  usePanelGroupContext,
} from "@nuvix/sui/components/resizable";
import { useSidebarHref } from "@/hooks/useSidebarHref";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { SidebarExpandTrigger } from "./components/sidebar_expand_trigger";
import { cn } from "@nuvix/sui/lib/utils";

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

const ProjectSidebar: React.FC<{ defaultSize: number }> = ({ defaultSize }) => {
  const sidebar = useProjectStore.use.sidebar();
  const { showSubSidebar: show, setShowSubSidebar: setShowSidebar } = useProjectStore((s) => s);
  const showSubSidebar = sidebar.first || sidebar.middle || sidebar.last;
  const ref = React.useRef<ImperativePanelHandle | null>(null);

  function handleExpandTrigger() {
    if (ref.current) {
      ref.current.expand();
    }
    setShowSidebar(true);
  }

  return (
    <>
      <FirstSidebar />
      {!show && <SidebarExpandTrigger onClick={handleExpandTrigger} />}
      {showSubSidebar ? (
        <ResizablePanel
          id="sidebar"
          order={1}
          collapsible
          ref={ref}
          collapsedSize={1}
          onCollapse={() => setShowSidebar(false)}
          onExpand={() => setShowSidebar(true)}
          defaultSize={defaultSize}
          minSize={18}
          maxSize={23}
          className="hidden ml:flex"
        >
          {show ? <SecondSidebar /> : null}
        </ResizablePanel>
      ) : (
        <span className="w-0 ml:w-2" />
      )}
    </>
  );
};

interface FirstSidebarProps {
  inMobile?: boolean;
  onClose?: () => void;
}

export const FirstSidebar = ({ inMobile, onClose }: FirstSidebarProps) => {
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
      name: "Collection Editor",
      href: href(`collections`),
      icon: "collectionEditor",
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
      name: "Authentication",
      href: href(`authentication/users`),
      active: isIncludes("authentication"),
      icon: "authentication",
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
    // {
    //   name: "Functions",
    //   href: href(`functions`),
    //   icon: "functions",
    //   active: isIncludes("functions"),
    // },
    {
      name: "Messaging",
      href: href(`messaging`),
      icon: "messaging",
      active: isIncludes("messaging"),
    },
  ];

  return (
    <>
      <Column
        maxWidth={inMobile ? undefined : 3.5}
        fill
        paddingBottom="8"
        paddingTop={inMobile ? "32" : undefined}
        vertical="space-between"
        position="relative"
        overflowY="auto"
        className={cn("transition-[max-width] duration-200 ease-in-out no-scrollbar", {
          "!hidden ml:!flex": !inMobile,
        })}
        background={inMobile ? "transparent" : "surface"}
      >
        <Column fillWidth gap="8">
          {sideNav.map((item, index) => (
            <>
              {index === 4 && <Line />}
              <SidebarSmallButton
                key={index}
                item={item}
                showFullSidebar={!!inMobile}
                onClose={onClose}
                selected={item.active ?? pathname.includes(item.href ?? "")}
              />
            </>
          ))}
        </Column>

        <Column fillWidth gap="8">
          <Line />

          <SidebarSmallButton
            item={{
              name: "Settings",
              href: `/project/${id}/s/general`,
              icon: "settings",
            }}
            showFullSidebar={!!inMobile}
            onClose={onClose}
            selected={pathname === `/project/${id}/settings`}
          />
        </Column>
      </Column>
    </>
  );
};

interface SecondSidebarProps {
  inMobile?: boolean;
  onClose?: () => void;
}

export const SecondSidebar = ({ inMobile, onClose }: SecondSidebarProps) => {
  const sidebar = useProjectStore.use.sidebar();

  return sidebar.first || sidebar.middle || sidebar.last ? (
    <Column fillWidth>
      {sidebar.title && (
        <Row
          paddingY="4"
          marginX="16"
          marginBottom="8"
          marginTop="4"
          radius="l"
          className="relative"
        >
          <Text
            variant="body-strong-s"
            className="text-(--neutral-on-background-strong) dark:text-(--neutral-on-background-medium)"
          >
            {sidebar.title}
          </Text>
        </Row>
      )}
      <Column gap="m" position="relative" overflowX="hidden" overflowY="auto">
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
  onClose,
}: {
  item: ProjectSidebarData;
  showFullSidebar: boolean;
  selected?: boolean;
  onClose?: () => void;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ToggleButton
          size="m"
          href={item.href}
          justifyContent={showFullSidebar ? "flex-start" : "center"}
          selected={selected ?? false}
          onClick={onClose ?? item.onClick}
          disabled={item.disabled}
          prefixIcon={showFullSidebar ? item.icon : undefined}
          label={showFullSidebar && item.name}
          className={cn({ "": !showFullSidebar }, "!size-10 mx-auto")}
        >
          {!showFullSidebar && <Icon size="m" name={item.icon} />}
        </ToggleButton>
      </TooltipTrigger>
      <TooltipContent side="right">{item.name}</TooltipContent>
    </Tooltip>
  );
};

ProjectSidebar.displayName = "Sidebar";
export { ProjectSidebar };
