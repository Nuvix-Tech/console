"use client";
import { useParams, usePathname } from "next/navigation";
import { Line } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { useEffect } from "react";
import { useProjectStore } from "@/lib/store";

function Wrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams();
  const setSidebar = useProjectStore.use.setSidebar?.();
  const pathname = usePathname();

  const basePath = `/project/${id}/authentication/`;
  const resolveHref = (path: string) => `${basePath}${path}`;
  const resolveIsSelected = (path: string) => pathname.includes(resolveHref(path));

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
            isSelected: resolveIsSelected("security"),
          },
          {
            label: "Templates",
            href: resolveHref("templates"),
            isSelected: resolveIsSelected("templates"),
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

  useEffect(() => {
    setSidebar({ middle });
  }, [middle, setSidebar]);

  return <>{children}</>;
}

export { Wrapper as ProjectAuthWrapper };
