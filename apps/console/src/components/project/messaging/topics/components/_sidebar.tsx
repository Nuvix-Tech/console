import { useProjectStore } from "@/lib/store";
import { SidebarGroup } from "@/ui/layout/navigation";
import { usePathname } from "next/navigation";
import { useTopicStore } from "./store";

export const TopicSidebar = () => {
  const project = useProjectStore.use.project?.();
  const { topic } = useTopicStore((state) => state);
  const path = usePathname();

  const resolveHref = (value?: string) =>
    `/project/${project?.$id}/messaging/topics/${topic?.$id}${value ? `/${value}` : ""}`;
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
            label: "Activity",
            href: resolveHref("activity"),
            isSelected: resolveIsSelected("activity"),
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
