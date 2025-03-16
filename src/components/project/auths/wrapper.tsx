"use client";
import { usePathname } from "next/navigation";
import { Line } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { useEffect } from "react";
import { useProjectStore } from "@/lib/store";

function Wrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const project = useProjectStore.use.project?.();
  const setSidebar = useProjectStore.use.setSidebar?.();
  const pathname = usePathname() ?? "";

  const resolveHref = (path: string) => `/project/${project?.$id}/authentication/${path}`;
  const resolveIsSelected = (value: string) => pathname.includes(resolveHref(value));

  const middle = (
    <>
      <SidebarGroup
        title="Manage"
        items={[
          {
            label: "Users",
            href: resolveHref("users"),
            isSelected: resolveIsSelected("users"),
          },
          {
            label: "Teams",
            href: resolveHref("teams"),
            isSelected: resolveIsSelected("teams"),
          },
        ]}
      />

      <Line />

      <SidebarGroup
        title="Configuration"
        items={[
          {
            label: "Security",
            href: resolveHref("security"),
          },
          {
            label: "Templates",
            href: resolveHref("templates"),
          },
          {
            label: "Usage",
            href: resolveHref("usage"),
          },
          {
            label: "Settings",
            href: resolveHref("settings"),
          },
        ]}
      />
    </>
  );

  useEffect(() => {
    setSidebar({ middle });
  }, []);

  return <>{children}</>;
}

export { Wrapper as ProjectAuthWrapper };
