"use client";

import { useAppStore } from "@/lib/store";
import { Column, Icon, IconButton, Line, Row, Tag, Text, ToggleButton } from "@nuvix/ui/components";
import { usePathname } from "next/navigation";
import { GoArrowUpRight } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";

type Props = {
  inMobile?: boolean;
};

const ConsoleSidebar: React.FC<Props> = ({ inMobile }) => {
  const pathname = usePathname() ?? "";
  const organization = useAppStore.use.organization?.();

  return (
    <Column
      // maxWidth={inMobile ? undefined : 16}
      fillWidth
      fillHeight
      paddingX={inMobile ? "16" : "0"}
      paddingY="20"
      gap="xs"
      hide={inMobile ? undefined : "s"}
      background={inMobile ? "transparent" : "surface"}
      radius="l"
      // position={inMobile ? "relative" : "fixed"}
      border="neutral-medium"
      role="navigation"
      aria-label="Console Sidebar"
      overflowY="auto"
    >
      <Column fill gap="m" paddingBottom="40">
        {/* Projects Section */}
        <Column gap="4" className="mx-4">
          <SidebarTitle title="Projects" />
          <SidebarItem
            label="All Projects"
            selected={pathname.split("/")[-1] === organization?.$id}
          />
          <SidebarItem label="New Project" selected={pathname.split("/")[1] === "new-project"} />
        </Column>

        <Line background="neutral-alpha-weak" />

        {/* Account Section */}
        <Column gap="4" className="mx-4">
          <SectionHeader label={organization?.name ?? "Organization"} />
          <SidebarItem label="Members" selected={false} />
          <SidebarItem label="Billing" selected={pathname === "analytics"} />
          <SidebarItem label="Settings" selected={pathname === "reports"} />
        </Column>

        <Line background="neutral-alpha-weak" />

        {/* Account Section */}
        <Column gap="4" className="mx-4">
          <SectionHeader label="Account" />
          <SidebarItem label="Preferences" selected={false} />
          <SidebarItem label="Audit Logs" selected={pathname === "analytics"} />
          {/* Uncomment if needed */}
          {/* <SidebarItem
            label="Reports"
            icon="PiNotebookDuotone"
            selected={pathname === "reports"}
            tag="New"
          /> */}
        </Column>

        <Line background="neutral-alpha-weak" />

        {/* Documentation Section */}
        <Column gap="4" className="mx-4">
          <SectionHeader label="Documentation" />
          <SidebarItem label="Guides" icon={GoArrowUpRight} selected={false} />
          <SidebarItem
            label="API Reference"
            icon={GoArrowUpRight}
            selected={pathname === "analytics"}
          />
        </Column>

        <Line background="neutral-alpha-weak" />
      </Column>
    </Column>
  );
};

// Reusable Sidebar Item Component
type SidebarItemProps = {
  label: string;
  icon?: string | React.ElementType;
  selected: boolean;
  tag?: string;
};

const SidebarItem = ({ label, selected, icon: IICON, tag }: SidebarItemProps) => {
  return (
    <ToggleButton
      size="l"
      fillWidth
      justifyContent="flex-start"
      selected={selected}
      role="menuitem"
      aria-label={label}
    >
      <Row padding="4" vertical="center" gap="12" textVariant="label-default-m">
        {IICON && (
          <Icon
            name={<IICON size={18} />}
            onBackground="neutral-weak"
            size="s"
            aria-hidden="true"
            className="-ml-2"
          />
        )}
        {label}
        {tag && (
          <Tag variant="neutral" size="s" position="absolute" right="8">
            {tag}
          </Tag>
        )}
      </Row>
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
