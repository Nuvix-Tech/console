"use client";
import { CardBox } from "@/components/others/card";
import { getCollectionPageState, getDbPageState, getDocumentPageState } from "@/state/page";
import { Column } from "@/ui/components";
import React from "react";

type Props = {
  id: string;
  databaseId: string;
  collectionId: string;
  documentId: string;
};

const DocumentPage: React.FC<Props> = ({ id, databaseId, collectionId, documentId }) => {
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
    <Column gap="20" padding="20" fillWidth>
      <MetaData />
    </Column>
  );
};

const MetaData = () => {
  const { document } = getDocumentPageState();
  const { collection } = getCollectionPageState();
  const { database } = getDbPageState();

  return (
    <CardBox>
      <p>Document: {document?.$id}</p>
      <p>Collection: {collection?.$id}</p>
      <p>Database: {database?.$id}</p>
    </CardBox>
  );
};

export { DocumentPage };
