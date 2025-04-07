import { useDatabaseStore, useProjectStore } from "@/lib/store";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { usePathname } from "next/navigation";

const DatbaseSidebar = () => {
  const project = useProjectStore.use.project?.();
  const database = useDatabaseStore.use.database?.();
  const path = usePathname();

  const resolveHref = (value?: string) =>
    `/project/${project?.$id}/d-schema/${database?.$id}${value ? `/${value}` : ""}`;
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
