"use client";

import { getProjectSdk, sdkForConsole } from "@/lib/sdk";
import React from "react";
import { projectState } from "@/state/project-state";
import { appState } from "@/state/app-state";

export default function ProjectWrapper({
  children,
  id,
}: { children: React.ReactNode; id: string }) {
  const { projects, organizations } = sdkForConsole;

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

  return <>{children}</>;
}
