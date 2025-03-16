"use client";

import { getProjectSdk, sdkForConsole } from "@/lib/sdk";
import React, { useEffect, useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useApp, useProject } from "@/lib/store";

export default function ProjectWrapper({
  children,
  id,
}: { children: React.ReactNode; id: string }) {
  const { projects, organizations } = sdkForConsole;

  const { setOrganization, setScopes } = useApp()
  const { setProject, setScopes: setProjectScopes, setUpdateFn } = useProject()

  // const fetcher = useMemo(
  //   () =>
  //     [projects, organizations],
  // );

  // const { data, isFetching } = useSuspenseQuery({
  //   queryKey: ["project", id],
  //   queryFn: () => fetcher(id),
  // });

  // console.log("Fetching:", isFetching, id, data);
  console.log('RENDERING THE CONSOLE WRAPPER')

  useEffect(() => {
    async function get() {
      let project = await projects.get(id);
      const org = await organizations.get(project.teamId);
      const scopes = await organizations.getScopes(project.teamId);
      setProject(project)
      setOrganization(org);
      setScopes(scopes);
      setUpdateFn(async () => {
        let p = await projects.get(id);
        setProject(p)
      });
      setProjectScopes(scopes);
    }
    get()
  }, [id]);

  return <>{children}</>;
}
