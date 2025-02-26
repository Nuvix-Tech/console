"use client";
import { collectionPageState } from "@/state/page";
import { getProjectState, projectState } from "@/state/project-state";
import { notFound } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";
import { CollectionSidebar, CollectionsSiderbar } from "./components";

type Props = PropsWithChildren & {
  databaseId: string;
  collectionId: string;
};

export const CollectionLayout: React.FC<Props> = ({ children, databaseId, collectionId }) => {
  const { sdk } = getProjectState();

  projectState.sidebar.first = <CollectionSidebar />;
  projectState.sidebar.middle = <CollectionsSiderbar />;

  collectionPageState._update = async () => {
    const coll = await sdk?.databases.getCollection(databaseId, collectionId);
    collectionPageState.collection = coll;
  };

  useEffect(() => {
    if (!sdk) return;
    async function get() {
      try {
        const coll = await sdk?.databases.getCollection(databaseId, collectionId);
        collectionPageState.collection = coll;
        collectionPageState.loading = false;
      } catch (e: any) {
        if (e.code === 404) notFound();
      }
    }
    get();
  }, [sdk, databaseId, collectionId]);

  return <>{children}</>;
};
