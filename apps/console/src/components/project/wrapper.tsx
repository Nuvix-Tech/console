"use client";
import { sdkForConsole } from "@/lib/sdk";
import React, { useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAppStore, useProjectStore } from "@/lib/store";
import { UploadProvider } from "@/ui/uploader";

export default function ProjectWrapper({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const { projects, organizations } = sdkForConsole;

  const setOrganization = useAppStore.use.setOrganization();
  const setScopes = useAppStore.use.setScopes();
  const setProject = useProjectStore.use.setProject();
  const setProjectScopes = useProjectStore.use.setScopes();
  const setUpdateFn = useProjectStore.use.setUpdateFn();

  async function fetcher() {
    let project = await projects.get(id);
    const org = await organizations.get(project.teamId);
    const scopes = await organizations.getScopes(project.teamId);
    return { project, org, scopes };
  }

  const { data } = useSuspenseQuery({
    queryKey: ["project", id],
    queryFn: fetcher,
  });

  useEffect(() => {
    if (!data) return;
    const { project, org, scopes } = data;
    setProject(project);
    setOrganization(org);
    setScopes(scopes);
    setUpdateFn(async () => {
      let p = await projects.get(id);
      setProject(p);
    });
    setProjectScopes(scopes);
  }, [data]);

  return (
    <>
      <UploadProvider>{children}</UploadProvider>
    </>
  );
}
