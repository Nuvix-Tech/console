"use client";

import { useEffect } from "react";
import { useProject } from "@/hooks/useProject";

function Wrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setSideLinks } = useProject();

  useEffect(() => {
    const projectElement = document.getElementById("project");
    setSideLinks([
      {
        name: "Users",
        icon: "users",
        href: "/console/project/[id]/authentication/users",
      },
    ]);
    if (projectElement) {
      projectElement.classList.add("show-sidebar-large");
    }
  }, []);

  return <>{children}</>;
}

export { Wrapper as ProjectAuthWrapper };
