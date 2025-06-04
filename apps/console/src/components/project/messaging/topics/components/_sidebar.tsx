import { useProjectStore } from "@/lib/store";
import { SidebarGroup } from "@/ui/layout/navigation";
import { usePathname } from "next/navigation";

export const TopicSidebar = () => {
  const project = useProjectStore.use.project?.();
  const path = usePathname();

  const resolveHref = (value?: string) =>
    `/project/${project?.$id}/messaging/topic${value ? `/${value}` : ""}`;
  const resolveIsSelected = (value?: string) => path.includes(resolveHref(value));

  return (
    <>
      <SidebarGroup
        title="Topic"
        items={[
          {
            label: "Subscribers",
            href: resolveHref(),
            isSelected: path === resolveHref(),
          },
          {
            label: "Topics",
            href: resolveHref("topics"),
            isSelected: resolveIsSelected("topics"),
          },
          {
            label: "Subscribers",
            href: resolveHref("subscribers"),
            isSelected: resolveIsSelected("subscribers"),
          },
        ]}
      />
    </>
  );
};
