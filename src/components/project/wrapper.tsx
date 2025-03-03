"use client";

import { getProjectSdk, sdkForConsole } from "@/lib/sdk";
import React from "react";
import { getProjectState, projectState } from "@/state/project-state";
import { appState } from "@/state/app-state";
import classNames from "classnames";

export default function ProjectWrapper({
  children,
  id,
}: { children: React.ReactNode; id: string }) {
  const { project, showSubSidebar, sidebar } = getProjectState();
  const { projects, organizations } = sdkForConsole;

  projectState._update = async () => {
    let p = await projects.get(id);
    projectState.project = p;
  };

  React.useEffect(() => {
    projects.get(id).then((project) => {
      projectState.project = project;
      projectState.sdk = getProjectSdk(project.$id);
      projectState.initialfetching = false;
      organizations.get(project.teamId).then((org) => (appState.organization = org));
      organizations.getScopes(project.teamId).then((scopes) => {
        appState.scopes = scopes;
        projectState.scopes = scopes; // TODO: get form project sdk after server updation
      });
    });
  }, [id]);

  return (
    <>
      <div
        id="project"
        className={classNames(
          `project show-sidebar`,
          { "show-sidebar-large": !!(sidebar.first || sidebar.middle || sidebar.last) },
          {
            "show-sidebar-small": !(sidebar.first || sidebar.middle || sidebar.last),
          },
        )}
      >
        {children}
      </div>
    </>
  );
}
