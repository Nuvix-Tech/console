import { Column } from "@nuvix/ui/components";
import { SidebarGroup } from "./layout";

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
          { label: "Quick start", icon: "audio" },
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
