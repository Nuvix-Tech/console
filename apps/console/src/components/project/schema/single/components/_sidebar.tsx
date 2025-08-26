import { useSidebarHref } from "@/hooks/useSidebarHref";
import { useDatabaseStore } from "@/lib/store";
import { SidebarGroup } from "@/ui/layout/navigation";

const DatbaseSidebar = () => {
  const database = useDatabaseStore.use.database?.();

  const { href, isEqual } = useSidebarHref({ prefix: `schema/${database?.$id}` });

  return (
    <>
      <SidebarGroup
        title="Database"
        items={[
          {
            label: "Collections",
            href: href(),
            isSelected: isEqual(),
          },
          {
            label: "Usage",
            href: href("usage"),
            isSelected: isEqual("usage"),
          },
          {
            label: "Settings",
            href: href("settings"),
            isSelected: isEqual("settings"),
          },
        ]}
      />
    </>
  );
};

export { DatbaseSidebar };
