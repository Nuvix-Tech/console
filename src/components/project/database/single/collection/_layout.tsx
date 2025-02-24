"use client";
import { collectionPageState } from "@/state/page";
import { getProjectState, projectState } from "@/state/project-state";
import { notFound } from "next/navigation";
import React, { PropsWithChildren } from "react";
import { CollectionSidebar } from "./components";

type Props = PropsWithChildren & {
  databaseId: string;
  collectionId: string;
};

export const CollectionLayout: React.FC<Props> = ({ children, databaseId, collectionId }) => {
  const { sdk } = getProjectState();
  projectState.sidebar.first = <CollectionSidebar />;

  sdk?.databases
    .getCollection(databaseId, collectionId)
    .then((v) => (collectionPageState.collection = v))
    .catch(notFound);

  return <>{children}</>;
};
