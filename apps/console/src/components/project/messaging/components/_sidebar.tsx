import { SidebarGroup } from "@/ui/layout/navigation";
import { useSidebarHref } from "@/hooks/useSidebarHref";

const MessagingSidebar = () => {
  const { href, isEqual, isIncludes } = useSidebarHref({ prefix: "messaging" });

  return (
    <>
      <SidebarGroup
        items={[
          {
            label: "Messages",
            href: href(),
            isSelected: isEqual() || isIncludes("messages"),
          },
          {
            label: "Topics",
            href: href("topics"),
            isSelected: isEqual("topics"),
          },
          {
            label: "Providers",
            href: href("providers"),
            isSelected: isIncludes("providers"),
          },
        ]}
      />
    </>
  );
};

export { MessagingSidebar };
