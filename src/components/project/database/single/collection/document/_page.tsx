"use client";
import { useCollectionStore, useDatabaseStore, useDocumentStore } from "@/lib/store";
import { DataMapper } from "./components";
import { PageContainer } from "@/components/others";

type Props = {
  id: string;
  databaseId: string;
  collectionId: string;
  documentId: string;
};

export const DocumentPage: React.FC<Props> = ({ id, databaseId, collectionId, documentId }) => {
  const document = useDocumentStore.use.document?.();
  const collection = useCollectionStore.use.collection?.();
  const database = useDatabaseStore.use.database?.();

  if (
    document?.$id !== documentId ||
    collection?.$id !== collectionId ||
    database?.$id !== databaseId
  )
    return;

  return (
    <>
      <PageContainer>
        <DataMapper attributes={collection.attributes as any} document={document} />
      </PageContainer>
    </>
  );
};
