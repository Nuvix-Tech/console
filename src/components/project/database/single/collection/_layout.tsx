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

  useEffect(() => {
    if (!sdk) return;
    sdk?.databases
      .getCollection(databaseId, collectionId)
      .then((v) => (collectionPageState.collection = v))
      .catch(() => notFound());
  }, [sdk, databaseId, collectionId]);

  return <>{children}</>;
};
