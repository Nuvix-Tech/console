"use client";

import { useAppStore } from "@/lib/store";
import { Column, IconProps, Tag, ToggleButton } from "@nuvix/ui/components";
import { useParams, usePathname } from "next/navigation";

type Props = {
  inMobile?: boolean;
};

const ConsoleSidebar: React.FC<Props> = ({ inMobile }) => {
  const pathname = usePathname() ?? "";
  const { id } = useParams<{ id: string }>();

  const _path = `/organizations/${id}`;
  const href = (path?: string) => _path + (path ? `/${path}` : "");
  const isSelected = (path?: string) => pathname === href(path);

  return (
    <Column
      fillWidth
      fillHeight
      paddingY="8"
      gap="xs"
      background="surface"
      role="navigation"
      aria-label="Console Sidebar"
      overflowY="auto"
    >
      <Column fill gap="4" paddingBottom="40" paddingX="8">
        <SidebarItem label="Projects" icon="projects" selected={isSelected()} href={href()} />
        <SidebarItem
          label="Members"
          icon="members"
          selected={isSelected("members")}
          href={href("members")}
        />
        <SidebarItem
          label="Usage"
          icon="usage"
          selected={isSelected("usage")}
          href={href("usage")}
        />

        <SidebarItem
          label="Billing"
          icon="billing"
          selected={isSelected("billing")}
          href={href("billing")}
        />
        <SidebarItem
          label="Settings"
          icon="settings"
          selected={isSelected("settings")}
          href={href("settings")}
        />
      </Column>
    </Column>
  );
};

// Reusable Sidebar Item Component
type SidebarItemProps = {
  label: string;
  icon?: IconProps["name"];
  selected?: boolean;
  tag?: string;
  href?: string;
};

const SidebarItem = ({ label, selected, icon, tag, href }: SidebarItemProps) => {
  return (
    <ToggleButton
      size="l"
      fillWidth
      justifyContent="flex-start"
      selected={selected}
      role="menuitem"
      aria-label={label}
      prefixIcon={icon}
      // className="!px-2"
      href={href}
    >
      {label}
      {tag && (
        <Tag variant="neutral" size="s" position="absolute" right="8">
          {tag}
        </Tag>
      )}
    </ToggleButton>
  );
};

ConsoleSidebar.displayName = "ConsoleSidebar";
export { ConsoleSidebar };
