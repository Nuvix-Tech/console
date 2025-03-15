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
    const org = await organizations.get(project.teamId);
    const scopes = await organizations.getScopes(project.teamId);
    return { project, org, scopes };
  };

  const { data } = useSWR(id, fetcher);

  const project: any = data?.project;

  projectState.project = project;
  projectState.sdk = getProjectSdk(project.$id);
  projectState.initialfetching = false;
  appState.organization = data?.org!;
  appState.scopes = data?.scopes!;
  projectState.scopes = data?.scopes!;

  return <>{children}</>;
}
