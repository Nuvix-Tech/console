import { useBucketStore, useProjectStore } from "@/lib/store";
import { Line } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { usePathname } from "next/navigation";
import { BucketsList } from "./_buckets";

const StorageSidebar = () => {
  const project = useProjectStore.use.project?.();
  const bucket = useBucketStore.use.bucket?.();
  const path = usePathname();

  const resolveHref = (value?: string) =>
    `/project/${project?.$id}/buckets${value ? `/${value}` : ""}`;
  const resolveIsSelected = (value?: string) => path.includes(resolveHref(value));

  return (
    <>
      <SidebarGroup title="Storage" items={[]} />

      <BucketsList />

      <Line />

      <SidebarGroup
        title="Configuration"
        items={[
          {
            label: "Settings",
            href: resolveHref(`${bucket?.$id}/settings`),
            isSelected: path === resolveHref(`${bucket?.$id}/settings`),
          },
        ]}
      />
    </>
  );
};

export { StorageSidebar };
