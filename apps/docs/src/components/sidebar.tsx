"use client";
import { Column, Row, Text, ToggleButton } from "@nuvix/ui/components";
import { SidebarGroup } from "./layout";
import { Node } from "fumadocs-core/page-tree";
import React, { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@nuvix/sui/lib/utils";

/**
 * @deprecated
 */
export const Sidebar = () => {
  return (
    <Column
      fillHeight
      width={16}
      borderRight="surface"
      overflowY="auto"
      top="64"
      left="0"
      position="fixed"
      paddingTop="8"
      paddingBottom="80"
      paddingX="4"
      gap="16"
    >
      <SidebarGroup
        items={[
          { label: "Home", icon: "house" },
          { label: "Quick start", icon: "audio", href: "test" },
          { label: "Tutorials", icon: "document" },
          { label: "SDKs", icon: "security" },
          { label: "API references", icon: "code", endIcon: "chevronRight" },
        ]}
      />

      <SidebarGroup
        title="Products"
        items={[
          { label: "Authentication", icon: "authentication", endIcon: "chevronRight" },
          { label: "Database", icon: "database", endIcon: "chevronRight" },
          { label: "Storage", icon: "storage", endIcon: "chevronRight" },
          { label: "Messaging", icon: "messaging", endIcon: "chevronRight" },
          { label: "Functions", icon: "functions", endIcon: "chevronRight" },
        ]}
      />

      <SidebarGroup title="Apis" items={[{ label: "REST", icon: "archive" }]} />

      <SidebarGroup
        title="Tooling"
        items={[
          { label: "CLI", icon: "runner", endIcon: "chevronRight" },
          { label: "Assistant", icon: "sparkle" },
          { label: "Command center", icon: "check" },
          { label: "MCP Server", icon: "computer" },
        ]}
      />

      <SidebarGroup
        title="Advanced"
        items={[{ label: "Platform", endIcon: "chevronRight" }, { label: "Integeration" }]}
      />
    </Column>
  );
};

export const RenderNodes = ({ nodes }: { nodes: Node[] }) => {
  const pathname = usePathname();
  return (
    <Column gap="4">
      {nodes.map((node, idx) => {
        const key = `${node.type}-${idx}`;

        if (node.type === "folder") {
          const [isOpen, setIsOpen] = React.useState(false);
          return (
            <Fragment key={key}>
              <ToggleButton
                fillWidth
                justifyContent="flex-start"
                prefixIcon={node.icon}
                suffixIcon={isOpen ? "chevronDown" : "chevronRight"}
                size="m"
                onClick={() => setIsOpen(!isOpen)}
                className="neutral-on-background-medium"
              >
                <Row vertical="center" gap="12" textVariant="label-default-s">
                  {!!node.index ? <Link href={node.index?.url}>{node.name}</Link> : node.name}
                </Row>
              </ToggleButton>
              {isOpen && (
                <Column paddingLeft="8" gap="4" marginTop="4">
                  <RenderNodes nodes={node.children} />
                </Column>
              )}
            </Fragment>
          );
        }

        if (node.type === "separator") {
          return (
            <Fragment key={key}>
              <hr className="my-1 border-fd-border" />
              {node.name && (
                <Text
                  variant="body-default-xs"
                  className="uppercase my-1 pl-1"
                  onBackground="neutral-weak"
                >
                  {node.name}
                </Text>
              )}
            </Fragment>
          );
        }

        const isActive = pathname.endsWith(node.url);
        return (
          <ToggleButton
            key={key}
            fillWidth
            href={node.url}
            justifyContent="flex-start"
            prefixIcon={node.icon}
            size="m"
            selected={isActive}
            className={cn("neutral-on-background-medium")}
          >
            <Row vertical="center" gap="12" textVariant="label-default-s">
              {node.name}
            </Row>
          </ToggleButton>
        );
      })}
    </Column>
  );
};
