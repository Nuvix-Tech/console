"use client";
import { documentPageState } from "@/state/page";
import { getProjectState, projectState } from "@/state/project-state";
import { notFound } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";

type Props = PropsWithChildren & {
  databaseId: string;
  collectionId: string;
  documentId: string;
};

export const DocumentLayout: React.FC<Props> = ({
  children,
  databaseId,
  collectionId,
  documentId,
}) => {
  const { sdk } = getProjectState();
  projectState.sidebar.first = null;
  useEffect(() => {
    if (!sdk) {
      return;
    }
    sdk.databases
      .getDocument(databaseId, collectionId, documentId)
      .then((v) => (documentPageState.document = v))
      .catch(notFound);
  }, [sdk, databaseId, collectionId, documentId]);

  return <>{children}</>;
};
