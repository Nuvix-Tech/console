"use client";

import { getProjectSdk, sdkForConsole } from "@/lib/sdk";
import { dispatchData, ProjectContext } from "@/lib/store/project";
import React from "react";
import { ProjectSidebarData } from "../console/sidebar";
import { getProjectState, projectState } from "@/state/project-state";

export default function ProjectWrapper({
  children,
  id,
}: { children: React.ReactNode; id: string }) {
  const { project, sdk, initialfetching } = getProjectState();
  const { projects } = sdkForConsole;

  React.useEffect(() => {
    projects.get(id).then((project) => {
      projectState.project = project;
      projectState.sdk = getProjectSdk(project.$id);
      projectState.initialfetching = false;
    });
  }, [id]);

  const update = (data: any) => {};

  const dispatch = ({ action, data }: dispatchData) => {};

  return (
    <>
      <ProjectContext.Provider
        value={{
          data: { project, loading: initialfetching, sdk, sideLinks: [] },
          dispatch: dispatch,
          update: update,
        }}
      >
        {children}
      </ProjectContext.Provider>
    </>
  );
}
