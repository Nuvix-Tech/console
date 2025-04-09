"use client";
import { useBucketStore, useProjectStore } from "@/lib/store";
import { StorageSidebar } from "../components/_sidebar";
import { useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

export interface Props {
  id: string;
  bucketId: string;
}

export const StorageSingleLayout = ({
  children,
  bucketId,
}: {
  children: React.ReactNode;
} & Props) => {
  const sdk = useProjectStore.use.sdk?.();
  const setSidebar = useProjectStore.use.setSidebar();
  const setRefreshFn = useBucketStore.use.setRefresh();
  const setBucket = useBucketStore.use.setBucket();
  const first = <StorageSidebar />;

  useEffect(() => {
    setSidebar({ first, last: null, middle: null });
    setRefreshFn(async () => {
      setBucket(await sdk?.storage.getBucket(bucketId));
    });
  }, [bucketId]);

  const fetcher = async () => {
    return await sdk.storage.getBucket(bucketId);
  };

  const { data } = useSuspenseQuery({
    queryKey: ["bucket", bucketId],
    queryFn: fetcher,
  });

  useEffect(() => {
    setBucket(data);
  }, [data, bucketId]);

  return <>{children}</>;
};
