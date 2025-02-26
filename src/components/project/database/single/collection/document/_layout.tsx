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

  documentPageState._update = async () => {
    const doc = await sdk?.databases.getDocument(databaseId, collectionId, documentId)
    documentPageState.document = doc;
  }

  useEffect(() => {
    if (!sdk) {
      return;
    }
    async function get() {
      try {
        const doc = await sdk?.databases.getDocument(databaseId, collectionId, documentId)
        documentPageState.document = doc;
        documentPageState.loading = false;
      } catch (e: any) {
        if (e.code === 404) notFound();
      }
    }
    get();
  }, [sdk, databaseId, collectionId, documentId]);

  return <>{children}</>;
};
