"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { sdkForConsole } from "@/lib/sdk";
import { useAppStore, useProjectStore } from "@/lib/store";
import { useListSchemasQuery } from "@/data/database/schemas-query";
import { UploadProvider } from "@/ui/uploader";
import { isPlatform } from "@/lib/constants";
import { Models } from "@nuvix/console";
import { rootKeys } from "@/lib/keys";
import ErrorPage from "../others/page-error";
import { SkeletonProject } from "../skeletons";

export default function ProjectWrapper({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { projects, organizations } = sdkForConsole;

  const setOrganization = useAppStore.use.setOrganization();
  const setScopes = useAppStore.use.setScopes();

  const setProject = useProjectStore.use.setProject();
  const setProjectScopes = useProjectStore.use.setScopes();
  const setUpdateFn = useProjectStore.use.setUpdateFn();
  const sdk = useProjectStore.use.sdk();
  const setSchemas = useProjectStore.use.setSchemas();

  const {
    data: projectData,
    isLoading: projectLoading,
    isError: projectError,
    error: projectErrObj,
    isFetching,
  } = useQuery({
    queryKey: rootKeys.project(id),
    queryFn: async () => await projects.get(id),
    retry: (failureCount, error: any) => {
      // Retry up to 2 times unless it's a permission or not found error
      if (error?.code === 401 || error?.code === 404) return false;
      return failureCount < 2;
    },
    staleTime: 60_000, // 1 minute of caching
  });

  const { data: orgData } = useQuery({
    queryKey: rootKeys.organization(projectData?.teamId),
    queryFn: async () => projectData && organizations.get(projectData.teamId),
    enabled: !!projectData && isPlatform,
    staleTime: Infinity,
  });

  const { data: scopeData } = useQuery({
    queryKey: rootKeys.scopes(projectData?.teamId),
    queryFn: async () =>
      projectData && isPlatform
        ? organizations.getScopes(projectData.teamId)
        : ({ scopes: [], roles: [] } as Models.Roles),
    enabled: !!projectData && isPlatform,
    staleTime: Infinity,
  });

  const { data: schemas } = useListSchemasQuery(
    { projectRef: projectData?.$id, sdk },
    { enabled: !!projectData && !!sdk, staleTime: Infinity },
  );

  useEffect(() => {
    if (!projectData) return;
    setProject(projectData);
    setUpdateFn(async () => {
      const updated = await projects.get(id);
      setProject(updated);
    });
  }, [projectData, id, setProject, setUpdateFn, projects]);

  useEffect(() => {
    if (orgData) setOrganization(orgData);
  }, [orgData, setOrganization]);

  useEffect(() => {
    if (scopeData) {
      setScopes(scopeData);
      setProjectScopes(scopeData);
    }
  }, [scopeData, setScopes, setProjectScopes]);

  useEffect(() => {
    if (schemas?.data) setSchemas(schemas.data);
  }, [schemas, setSchemas]);

  if (projectLoading || isFetching) return <SkeletonProject />;

  if (projectError) {
    // Offline / network error fallback
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return (
        <ErrorPage error={new Error("You’re offline. Please check your network connection.")} />
      );
    }

    console.error("Project load failed:", projectErrObj);
    return <ErrorPage error={projectErrObj} />;
  }

  return <UploadProvider>{children}</UploadProvider>;
}
