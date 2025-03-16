"use client";
import { notFound } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";
import { CollectionSidebar, CollectionsSiderbar } from "./components";
import { useCollectionStore, useProjectStore } from "@/lib/store";

type Props = PropsWithChildren & {
  databaseId: string;
  collectionId: string;
};

export const CollectionLayout: React.FC<Props> = ({ children, databaseId, collectionId }) => {
  const sdk = useProjectStore.use.sdk?.();
  const setSidebar = useProjectStore.use.setSidebar();
  const setRefreshFn = useCollectionStore.use.setRefresh();
  const setCollection = useCollectionStore.use.setCollection();
  const setLoading = useCollectionStore.use.setLoading();

  const first = <CollectionSidebar />;
  const middle = <CollectionsSiderbar />;

  useEffect(() => {
    setSidebar({ first, middle });
    setRefreshFn(async () => {
      const coll = await sdk?.databases.getCollection(databaseId, collectionId);
      setCollection(coll);
    });
  }, [setRefreshFn]);

  async function get() {
    if (!sdk) return;
    try {
      const coll = await sdk?.databases.getCollection(databaseId, collectionId);
      setCollection(coll);
      setLoading(false);
    } catch (e: any) {
      if (e.code === 404) notFound();
    }
  }

  useEffect(() => {
    get();
  }, [sdk, databaseId, collectionId]);

  return <>{children}</>;
};
