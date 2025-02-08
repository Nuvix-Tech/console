"use client";

import { getProjectSdk, sdkForConsole } from "@/lib/sdk";
import { dispatchData, ProjectContext } from "@/lib/store/project";
import React from "react";
import { ProjectSidebarData } from "../console/sidebar";

export default function ProjectWrapper({
  children,
  id,
}: { children: React.ReactNode; id: string }) {
  const [project, setProject] = React.useState<any>(null);
  const [sdk, setSdk] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [sidebarLinks, setSidebarLinks] = React.useState<ProjectSidebarData[]>([]);

  const { projects } = sdkForConsole;

  React.useEffect(() => {
    setLoading(true);

    projects.get(id).then((project) => {
      setProject(project);
      setSdk(getProjectSdk(project.$id));
      setLoading(false);
    });
  }, [id]);

  const update = (data: any) => {
    setProject((prev: any) => ({ ...prev, ...data }));
  };

  const dispatch = ({ action, data }: dispatchData) => {
    switch (action) {
      case "UPDATE_PROJECT":
        update(data);
        break;
      case "UPDATE_SIDEBAR_LINKS":
        setSidebarLinks(data);
        break;
    }
  };

  return (
    <>
      <ProjectContext.Provider
        value={{
          data: { project, loading, sdk, sideLinks: sidebarLinks },
          dispatch: dispatch,
          update: update,
        }}
      >
        {children}
      </ProjectContext.Provider>
    </>
  );
}
