import { useProjectStore } from "@/lib/store";
import { Line } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { usePathname } from "next/navigation";

const DatbaseSidebar = () => {
  const project = useProjectStore.use.project?.();
  const path = usePathname();

  const resolveHref = (value?: string) =>
    `/project/${project?.$id}/database/${value ? `${value}` : ""}`;
  const resolveIsSelected = (value?: string) => path.includes(resolveHref(value));

  return (
    <>
      <SidebarGroup
        title="Database"
        items={[
          {
            label: "Schemas",
            href: resolveHref("schemas"),
            isSelected: path === resolveHref("schemas"),
          },
          {
            label: "Schema Visualizer",
            href: resolveHref("visualizer"),
            isSelected: resolveIsSelected("visualizer"),
          },
          {
            label: "Tables",
            href: resolveHref("tables"),
            isSelected: resolveIsSelected("tables"),
          },
        ]}
      />

      <Line fillWidth />

      <SidebarGroup
        title="Database Objects"
        items={[
          {
            label: "Functions",
            href: resolveHref("functions"),
            isSelected: resolveIsSelected("functions"),
          },
          {
            label: "Triggers",
            href: resolveHref("triggers"),
            isSelected: resolveIsSelected("triggers"),
          },
          {
            label: "Enumerated Types",
            href: resolveHref("enum-types"),
            isSelected: resolveIsSelected("enum-types"),
          },
          {
            label: "Extensions",
            href: resolveHref("extensions"),
            isSelected: resolveIsSelected("extensions"),
          },
          {
            label: "Indexes",
            href: resolveHref("indexes"),
            isSelected: resolveIsSelected("indexes"),
          },
          {
            label: "Publications",
            href: resolveHref("publications"),
            isSelected: resolveIsSelected("publications"),
          },
        ]}
      />

      <Line fillWidth />

      <SidebarGroup
        title="Security"
        items={[
          {
            label: "Access Control",
            href: resolveHref("access-control"),
            isSelected: resolveIsSelected("access-control"),
          },
          {
            label: "Roles",
            href: resolveHref("roles"),
            isSelected: resolveIsSelected("roles"),
          },
          {
            label: "Policies",
            href: resolveHref("policies"),
            isSelected: resolveIsSelected("policies"),
          },
        ]}
      />

      <Line fillWidth />

      <SidebarGroup
        title="Platform"
        items={[
          {
            label: "Backups",
            href: resolveHref("backups"),
            isSelected: resolveIsSelected("backups"),
          },
          {
            label: "Migrations",
            href: resolveHref("migrations"),
            isSelected: resolveIsSelected("migrations"),
          },
          {
            label: "Wrappers",
            href: resolveHref("wrappers"),
            isSelected: resolveIsSelected("wrappers"),
          },
          {
            label: "Webhooks",
            href: resolveHref("webhooks"),
            isSelected: resolveIsSelected("webhooks"),
          },
        ]}
      />

      <Line fillWidth />

      <SidebarGroup
        title="Tools"
        items={[
          {
            label: "Security Advisor",
            href: resolveHref("security-advisor"),
            isSelected: resolveIsSelected("security-advisor"),
          },
          {
            label: "Performance Advisor",
            href: resolveHref("performance-advisor"),
            isSelected: resolveIsSelected("performance-advisor"),
          },
          {
            label: "Query Performance",
            href: resolveHref("query-performance"),
            isSelected: resolveIsSelected("query-performance"),
          },
          {
            label: "Settings",
            href: resolveHref("settings"),
            isSelected: resolveIsSelected("settings"),
          },
          {
            label: "Usage",
            href: resolveHref("usage"),
            isSelected: resolveIsSelected("usage"),
          },
        ]}
      />
    </>
  );
};

export { DatbaseSidebar };
