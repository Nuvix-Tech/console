import { getProjectState } from "@/state/project-state";
import { Line } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { usePathname } from "next/navigation";

const SettingsSidebar = () => {
  const { project } = getProjectState();
  const path = usePathname();

  const resolveHref = (value?: string) =>
    `/console/project/${project?.$id}/settings${value ? `/${value}` : ""}`;
  const resolveIsSelected = (value?: string) => path.includes(resolveHref(value));

  return (
    <>
      <SidebarGroup
        items={[
          {
            label: "General",
            href: resolveHref(),
            isSelected: path === resolveHref(),
          },
        ]}
      />
      <SidebarGroup
        title="Configuration"
        items={[
          {
            label: "Cutstom Domains",
            href: resolveHref("domains"),
            isSelected: resolveIsSelected("domains"),
          },
          {
            label: "Webhooks",
            href: resolveHref("webhooks"),
            isSelected: resolveIsSelected("webhooks"),
          },
          {
            label: "Smtp",
            href: resolveHref("targets"),
            isSelected: resolveIsSelected("targets"),
          },
        ]}
      />
      <Line />
      <SidebarGroup
        title="OTHER"
        items={[
          {
            label: "Migrations",
            href: resolveHref("migrations"),
            isSelected: resolveIsSelected("migrations"),
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

export { SettingsSidebar };
