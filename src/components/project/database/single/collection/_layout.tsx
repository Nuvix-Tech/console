"use client";
import React, { PropsWithChildren, useEffect } from "react";
import { CollectionSidebar, CollectionsSiderbar } from "./components";
import { useCollectionStore, useProjectStore } from "@/lib/store";
import { useSuspenseQuery } from "@tanstack/react-query";

type Props = PropsWithChildren & {
  databaseId: string;
  collectionId: string;
};

export const CollectionLayout: React.FC<Props> = ({ children, databaseId, collectionId }) => {
  const sdk = useProjectStore.use.sdk?.();
  const setSidebar = useProjectStore.use.setSidebar();
  const setRefreshFn = useCollectionStore.use.setRefresh();
  const setCollection = useCollectionStore.use.setCollection();

  const first = <CollectionSidebar />;
  const middle = <CollectionsSiderbar />;

  useEffect(() => {
    setSidebar({ first, middle });
    setRefreshFn(async () => {
      const coll = await sdk?.databases.getCollection(databaseId, collectionId);
      setCollection(coll);
    });
  }, [setRefreshFn]);

  const fetcher = async () => {
    return await sdk.databases.getCollection(databaseId, collectionId);
  };

  const { data } = useSuspenseQuery({
    queryKey: ["collection", databaseId, collectionId],
    queryFn: fetcher,
  });

  useEffect(() => {
    setCollection(data);
  }, [data]);

  return <>{children}</>;
};
