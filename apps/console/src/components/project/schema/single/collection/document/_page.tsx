"use client";
import { useCollectionStore, useDocumentStore } from "@/lib/store";
import { DataMapper } from "./components";

type Props = {
  id: string;
  databaseId: string;
  collectionId: string;
  documentId: string;
};

export const DocumentPage: React.FC<Props> = () => {
  const document = useDocumentStore.use.document?.();
  const collection = useCollectionStore.use.collection?.();

  if (!document) return null;

  return (
    <>
      <DataMapper attributes={collection?.attributes ?? ([] as any)} document={document} />
    </>
  );
};
