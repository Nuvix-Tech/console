"use client";
import { GenericSkeletonLoader } from "@/components/editor/components/GenericSkeleton";
import ErrorPage from "@/components/others/page-error";
import { rootKeys } from "@/lib/keys";
import { sdkForConsole } from "@/lib/sdk";
import { useProjectStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { DeleteApiKey, TopMeta, UpdateExpire, UpdateName, UpdateScopes } from "./components";

export const KeyPage = ({ keyId }: { keyId: string }) => {
  const project = useProjectStore.use.project?.();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: rootKeys.key(project?.$id!, keyId),
    queryFn: () => sdkForConsole.projects.getKey(project?.$id!, keyId),
    enabled: !!project,
  });

  if (isError) {
    return <ErrorPage error={error} />;
  }

  return (
    <>
      <GenericSkeletonLoader isLoaded={!isLoading} />

      {data && !isLoading && (
        <>
          <TopMeta apiKey={data} />
          <UpdateName apiKey={data} />
          <UpdateScopes apiKey={data} />
          <UpdateExpire apiKey={data} />
          <DeleteApiKey apiKey={data} />
        </>
      )}
    </>
  );
};
