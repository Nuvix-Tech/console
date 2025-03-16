"use client";
import { Column } from "@/ui/components";
import { notFound } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";
import { LayoutTop } from "./components";
import { useDocumentStore, useProjectStore } from "@/lib/store";

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
  const document = useDocumentStore.use.document?.();
  const sdk = useProjectStore.use.sdk?.();
  const setRefreshFn = useDocumentStore.use.setRefresh();
  const setDocument = useDocumentStore.use.setDocument();
  const setLoading = useDocumentStore.use.setLoading();

  // projectState.sidebar.first = null;

  useEffect(() => {
    setRefreshFn(async () => {
      const doc = await sdk?.databases.getDocument(databaseId, collectionId, documentId);
      setDocument(doc);
    });
  }, []);

  useEffect(() => {
    if (!sdk) {
      return;
    }
    async function get() {
      try {
        const doc = await sdk?.databases.getDocument(databaseId, collectionId, documentId);
        setDocument(doc);
        setLoading(false);
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
