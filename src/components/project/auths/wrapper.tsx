"use client";

import { getProjectState, projectState } from "@/state/project-state";
import { usePathname } from "next/navigation";
import { Line } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { useEffect } from "react";

function Wrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = getProjectState();
  const pathname = usePathname() ?? "";

  const resolveHref = (path: string) =>
    `/console/project/${state.project?.$id}/authentication/${path}`;

  const resolveIsSelected = (path: string) => pathname.endsWith(path);

  projectState.sidebar.last = (
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
    const elementProject = document.getElementById("project");
    if (elementProject) {
      elementProject.classList.add("show-sidebar-large");
    }
  }, []);

  return <>{children}</>;
}

export { Wrapper as ProjectAuthWrapper };
