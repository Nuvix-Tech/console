import { getDbPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { usePathname } from "next/navigation";

const DatbaseSidebar = () => {
  const { project } = getProjectState();
  const { database } = getDbPageState();
  const path = usePathname();

  const resolveHref = (value?: string) =>
    `/project/${project?.$id}/databases/${database?.$id}${value ? `/${value}` : ""}`;
  const resolveIsSelected = (value?: string) => path.includes(resolveHref(value));

  return (
    <>
      <SidebarGroup
        title="Database"
        items={[
          {
            label: "Collections",
            href: resolveHref(),
            isSelected: path === resolveHref(),
          },
          {
            label: "Usage",
            href: resolveHref("usage"),
            isSelected: resolveIsSelected("usage"),
          },
          {
            label: "Settings",
            href: resolveHref("settings"),
            isSelected: resolveIsSelected("settings"),
          },
        ]}
      />
    </>
  );
};

export { DatbaseSidebar };
