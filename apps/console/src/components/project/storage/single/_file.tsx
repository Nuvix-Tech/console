"use client";
import { PageContainer } from "@/components/others";
import { useFileStore, useProjectStore } from "@/lib/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { DeleteFile, TopMeta, UpdatePermissions } from "./components";

export const FilePage = ({ bucketId, fileId }: { bucketId: string; fileId: string }) => {
  const sdk = useProjectStore.use.sdk();
  const setFile = useFileStore.use.setFile();
  const setRefresh = useFileStore.use.setRefresh();

  useEffect(() => {
    setRefresh(async () => {
      setFile(await sdk?.storage.getFile(bucketId, fileId));
    });
  }, []);

  const fetcher = async () => {
    const data = await sdk.storage.getFile(bucketId, fileId);
    return data;
  };

  const { data } = useSuspenseQuery({
    queryKey: ["file", bucketId, fileId],
    queryFn: fetcher,
  });

  useEffect(() => {
    if (data) {
      document.title = `File - ${data.name}`;
      setFile(data);
    }
  }, [data]);

  return (
    <PageContainer>
      <TopMeta />
      <UpdatePermissions />
      <DeleteFile />
    </PageContainer>
  );
};
