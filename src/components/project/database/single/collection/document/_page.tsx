"use client";
import { getCollectionPageState, getDbPageState, getDocumentPageState } from "@/state/page";
import { DataMapper } from "./components";
import { Column } from "@/ui/components";

type Props = {
  id: string;
  databaseId: string;
  collectionId: string;
  documentId: string;
};

export const DocumentPage: React.FC<Props> = ({ id, databaseId, collectionId, documentId }) => {
  const { document } = getDocumentPageState();
  const { collection } = getCollectionPageState();
  const { database } = getDbPageState();

  if (
    document?.$id !== documentId ||
    collection?.$id !== collectionId ||
    database?.$id !== databaseId
  )
    return;

  return (
    <>
      <Column gap="20" paddingX="20">
        <DataMapper attributes={collection.attributes as any} document={document} />
      </Column>
    </>
  );
};
