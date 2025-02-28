"use client";
import { documentPageState, getDocumentPageState } from "@/state/page";
import { getProjectState, projectState } from "@/state/project-state";
import { Column } from "@/ui/components";
import { notFound } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";
import { LayoutTop } from "./components";

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
  const { document } = getDocumentPageState();
  // projectState.sidebar.first = null;

  documentPageState._update = async () => {
    const doc = await sdk?.databases.getDocument(databaseId, collectionId, documentId);
    documentPageState.document = doc;
  };

  useEffect(() => {
    if (!sdk) {
      return;
    }
    async function get() {
      try {
        const doc = await sdk?.databases.getDocument(databaseId, collectionId, documentId);
        documentPageState.document = doc;
        documentPageState.loading = false;
      } catch (e: any) {
        if (e.code === 404) notFound();
      }
    }
    get();
  }, [sdk, databaseId, collectionId, documentId]);

  return (
    <>
      <Column fill>
        <LayoutTop title="Document" id={document?.$id} />
        {children}
      </Column>
    </>
  );
};
