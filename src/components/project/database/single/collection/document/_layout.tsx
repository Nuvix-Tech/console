"use client";
import { Column } from "@/ui/components";
import React, { PropsWithChildren, useEffect } from "react";
import { LayoutTop } from "./components";
import { useDocumentStore, useProjectStore } from "@/lib/store";
import { useSuspenseQuery } from "@tanstack/react-query";

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

  useEffect(() => {
    setRefreshFn(async () => {
      const doc = await sdk?.databases.getDocument(databaseId, collectionId, documentId);
      setDocument(doc);
    });
  }, []);

  const fetcher = async () => {
    return await sdk.databases.getDocument(databaseId, collectionId, documentId);
  };

  const { data } = useSuspenseQuery({
    queryKey: ["document", databaseId, collectionId, documentId],
    queryFn: fetcher,
  });

  useEffect(() => {
    setDocument(data);
  }, [data]);

  return (
    <>
      <Column fill>
        <LayoutTop title="Document" id={document?.$id} />
        {children}
      </Column>
    </>
  );
};
