"use client";

import { useAppStore } from "@/lib/store";
import {
  Column,
  Icon,
  IconButton,
  IconProps,
  Line,
  Row,
  Tag,
  Text,
  ToggleButton,
} from "@nuvix/ui/components";
import { usePathname } from "next/navigation";
import { SidebarGroup } from "./navigation";

type Props = {
  inMobile?: boolean;
};

const ConsoleSidebar: React.FC<Props> = ({ inMobile }) => {
  const pathname = usePathname() ?? "";
  const organization = useAppStore.use.organization?.();

  return (
    <Column
      fillWidth
      fillHeight
      paddingY="20"
      gap="xs"
      background="surface"
      role="navigation"
      aria-label="Console Sidebar"
      overflowY="auto"
    >
      <Column fill gap="4" paddingBottom="40" paddingX="8">
        <SidebarItem label="Projects" icon="image" selected />
        <SidebarItem label="Members" icon="person" />
        <SidebarItem label="Usage" icon="calendar" />

        <SidebarItem label="Billing" icon="eyeDropper" />
        <SidebarItem label="Settings" icon="security" />
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
};

const SidebarItem = ({ label, selected, icon, tag }: SidebarItemProps) => {
  return (
    <ToggleButton
      fillWidth
      justifyContent="flex-start"
      selected={selected}
      role="menuitem"
      aria-label={label}
      prefixIcon={icon}
      className="!px-2"
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

// Reusable Section Header Component
type SectionHeaderProps = {
  label: string;
};

const SectionHeader = ({ label }: SectionHeaderProps) => {
  return (
    <Text
      variant="body-default-s"
      onBackground="neutral-weak"
      marginBottom="8"
      marginLeft="8"
      aria-label={label}
    >
      {label}
    </Text>
  );
};

// Reusable Sidebar Title Component
type SidebarTitleProps = {
  title: string;
  button?: {
    icon?: string;
    tooltip?: string;
    onClick?: () => void;
  };
};

const SidebarTitle = ({ title, button }: SidebarTitleProps) => {
  return (
    <Row fillWidth horizontal="space-between" vertical="center" paddingBottom="8" marginLeft="8">
      <Text variant="body-default-s" onBackground="neutral-weak">
        {title}
      </Text>
      {button && (
        <IconButton
          tooltip={button.tooltip}
          variant="secondary"
          icon={button.icon}
          size="s"
          aria-label={button.tooltip}
        />
      )}
    </Row>
  );
};

ConsoleSidebar.displayName = "ConsoleSidebar";
export { ConsoleSidebar };
