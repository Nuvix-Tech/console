"use client";

import { IDChip, PageContainer, PageHeading } from "@/components/others";
import { rootKeys } from "@/lib/keys";
import { sdkForConsole } from "@/lib/sdk";
import { useProjectStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { DeletePlatform, UpdateName, UpdatePlatform } from "./components";
import { GenericSkeletonLoader } from "@/components/editor/components/GenericSkeleton";
import ErrorPage from "@/components/others/page-error";

export const PlatformPage = ({ platformId }: { platformId: string }) => {
  const { project } = useProjectStore((s) => s);

  const {
    data: platform,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: rootKeys.platform(project?.$id!, platformId),
    queryFn: async () => {
      if (!project) return;
      return await sdkForConsole.projects.getPlatform(project?.$id!, platformId);
    },
    enabled: !!project,
  });

  if (isError) return <ErrorPage error={error} />;

  return (
    <PageContainer>
      <GenericSkeletonLoader isLoaded={!isLoading} />
      {!isLoading && (
        <>
          <PageHeading
            heading={platform?.name || "Platform"}
            description={<IDChip id={platform?.$id} />}
          />

          <UpdateName platform={platform} />
          <UpdatePlatform platform={platform} />
          <DeletePlatform platform={platform} />
        </>
      )}
    </PageContainer>
  );
};
