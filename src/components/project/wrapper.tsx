"use client";

import { getProjectSdk, sdkForConsole } from "@/lib/sdk";
import React from "react";
import { projectState } from "@/state/project-state";
import { appState } from "@/state/app-state";
import useSWR from "swr";

export default function ProjectWrapper({
  children,
  id,
}: { children: React.ReactNode; id: string }) {
  const { projects, organizations } = sdkForConsole;

  projectState._update = async () => {
    let p = await projects.get(id);
    projectState.project = p;
  };

  const fetcher = async (id: string) => {
    let project = await projects.get(id);
    projectState.project = project;
    projectState.sdk = getProjectSdk(project.$id);
    projectState.initialfetching = false;
    const org = await organizations.get(project.teamId);
    appState.organization = org;
    const scopes = await organizations.getScopes(project.teamId);
    appState.scopes = scopes;
    projectState.scopes = scopes;
    return project;
  };

  const { data } = useSWR(id, fetcher);

  return <>{children}</>;
}
