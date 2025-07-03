"use client";
import { Line } from "@nuvix/ui/components";
import { SidebarGroup } from "@/ui/layout/navigation";
import { useEffect } from "react";
import { useProjectStore } from "@/lib/store";
import { useSidebarHref } from "@/hooks/useSidebarHref";

function Wrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const setSidebar = useProjectStore.use.setSidebar?.();
  const { href, isEqual } = useSidebarHref({ prefix: "authentication" });

  const middle = (
    <>
      <SidebarGroup
        title="Manage"
        items={[
          {
            label: "Users",
            href: href("users"),
            isSelected: isEqual("users"),
          },
          {
            label: "Teams",
            href: href("teams"),
            isSelected: isEqual("teams"),
          },
        ]}
      />

      <Line />

      <SidebarGroup
        title="Configuration"
        items={[
          {
            label: "Security",
            href: href("security"),
            isSelected: isEqual("security"),
          },
          {
            label: "Templates",
            href: href("templates"),
            isSelected: isEqual("templates"),
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

  useEffect(() => {
    setSidebar({ middle, title: "Authentication" });
  }, [middle, setSidebar]);

  return <>{children}</>;
}

export { Wrapper as ProjectAuthWrapper };
