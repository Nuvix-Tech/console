import { Line } from "@nuvix/ui/components";
import { SidebarGroup } from "@/ui/layout/navigation";
import { useSidebarHref } from "@/hooks/useSidebarHref";

const DatbaseSidebar = () => {
  const { href, isEqual, isIncludes } = useSidebarHref({ prefix: "database" });

  return (
    <>
      <SidebarGroup
        items={[
          {
            label: "Schemas",
            href: href("schemas"),
            isSelected: isEqual("schemas"),
          },
          {
            label: "Schema Visualizer",
            href: href("visualizer"),
            isSelected: isEqual("visualizer"),
          },
        ]}
      />

      <Line fillWidth />

      <SidebarGroup
        title="Database Objects"
        items={[
          {
            label: "Tables",
            href: href("tables"),
            isSelected: isIncludes("tables"),
          },
          {
            label: "Collections",
            href: href("collections"),
            isSelected: isIncludes("collections"),
          },
          {
            label: "Functions",
            href: href("functions"),
            isSelected: isIncludes("functions"),
          },
          {
            label: "Triggers",
            href: href("triggers"),
            isSelected: isIncludes("triggers"),
          },
          {
            label: "Enumerated Types",
            href: href("types"),
            isSelected: isIncludes("types"),
          },
          {
            label: "Extensions",
            href: href("extensions"),
            isSelected: isIncludes("extensions"),
          },
          {
            label: "Indexes",
            href: href("indexes"),
            isSelected: isIncludes("indexes"),
          },
          // {
          //   label: "Publications",
          //   href: href("publications"),
          //   isSelected: isIncludes("publications"),
          // },
        ]}
      />

      <Line fillWidth />

      <SidebarGroup
        title="Security"
        items={[
          // {
          //   label: "Access Control",
          //   href: href("access-control"),
          //   isSelected: isIncludes("access-control"),
          // },
          // {
          //   label: "Roles",
          //   href: href("roles"),
          //   isSelected: isIncludes("roles"),
          // },
          {
            label: "Policies",
            href: href("policies"),
            isSelected: isIncludes("policies"),
          },
        ]}
      />

      {/* <Line fillWidth /> */}

      {/* <SidebarGroup
        title="Tools"
        items={[
          {
            label: "Security Advisor",
            href: href("security-advisor"),
            isSelected: isIncludes("security-advisor"),
          },
          {
            label: "Performance Advisor",
            href: href("performance-advisor"),
            isSelected: isIncludes("performance-advisor"),
          },
          {
            label: "Query Performance",
            href: href("query-performance"),
            isSelected: isIncludes("query-performance"),
          },
          {
            label: "Settings",
            href: href("settings"),
            isSelected: isIncludes("settings"),
          },
          {
            label: "Usage",
            href: href("usage"),
            isSelected: isIncludes("usage"),
          },
        ]}
      /> */}
    </>
  );
};

export { DatbaseSidebar };
