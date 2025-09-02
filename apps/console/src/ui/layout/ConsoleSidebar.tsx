"use client";

import { cn } from "@nuvix/sui/lib/utils";
import { Column, IconProps, Tag, ToggleButton } from "@nuvix/ui/components";
import { useParams, usePathname } from "next/navigation";

type Props = {
  inMobile?: boolean;
  onClose?: () => void;
};

const ConsoleSidebar: React.FC<Props> = ({ inMobile, onClose }) => {
  const pathname = usePathname() ?? "";
  const { id } = useParams<{ id: string }>();

  const _path = `/organization/${id}`;
  const href = (path?: string) => _path + (path ? `/${path}` : "");
  const isSelected = (path?: string) => pathname === href(path);

  return (
    <Column
      fillWidth
      fillHeight
      paddingY="8"
      paddingTop={inMobile ? "40" : undefined}
      gap="xs"
      background="surface"
      role="navigation"
      aria-label="Console Sidebar"
      overflowY="auto"
    >
      <Column fill gap="4" paddingBottom="40" paddingX="8">
        <SidebarItem
          label="Projects"
          icon="projects"
          selected={isSelected()}
          href={href()}
          onClose={onClose}
        />
        <SidebarItem
          label="Members"
          icon="members"
          selected={isSelected("members")}
          href={href("members")}
          onClose={onClose}
        />
        <SidebarItem
          label="Usage"
          icon="usage"
          selected={isSelected("usage")}
          href={href("usage")}
          onClose={onClose}
        />

        <SidebarItem
          label="Billing"
          icon="billing"
          selected={isSelected("billing")}
          href={href("billing")}
          onClose={onClose}
        />
        <SidebarItem
          label="Settings"
          icon="settings"
          selected={isSelected("settings")}
          href={href("settings")}
          onClose={onClose}
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
  onClose: Props["onClose"];
};

const SidebarItem = ({ label, selected, icon, tag, href, onClose }: SidebarItemProps) => {
  return (
    <ToggleButton
      size="l"
      fillWidth
      variant="ghost"
      justifyContent="flex-start"
      selected={selected}
      role="menuitem"
      aria-label={label}
      prefixIcon={icon}
      className={cn("!px-3 !h-8 !min-h-8 !border-0 font-label", {
        "!text-(--neutral-on-background-weak)": !selected,
      })}
      onClick={onClose}
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
