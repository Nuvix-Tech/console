import { useProjectStore } from "@/lib/store";
import { Line } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { usePathname } from "next/navigation";

const StorageSidebar = () => {
  const project = useProjectStore.use.project?.();
  const path = usePathname();

  const resolveHref = (value?: string) =>
    `/project/${project?.$id}/buckets/${value ? `/${value}` : ""}`;
  const resolveIsSelected = (value?: string) => path.includes(resolveHref(value));

  return (
    <>
      <SidebarGroup
        title="Storage"
        items={[
          {
            label: "Buckets",
            href: resolveHref(),
            isSelected: path === resolveHref(),
          },
        ]}
      />
      <Line />

      <SidebarGroup
        title="Configuration"
        items={[
          {
            label: "Settings",
            href: resolveHref("settings"),
            isSelected: path === resolveHref("settings"),
          },
        ]}
      />
    </>
  );
};

export { StorageSidebar };
