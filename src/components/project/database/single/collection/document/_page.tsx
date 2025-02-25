"use client";
import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { formatDate } from "@/lib/utils";
import { getCollectionPageState, getDbPageState, getDocumentPageState } from "@/state/page";
import { Column } from "@/ui/components";
import { Text } from "@chakra-ui/react";
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

  return (
    <CardBox>
      <CardBoxBody>
        <CardBoxItem>
          <CardBoxTitle>Metadata</CardBoxTitle>
        </CardBoxItem>
        <CardBoxItem>
          <CardBoxDesc>Created: {formatDate(document?.$createdAt)}</CardBoxDesc>
          <CardBoxDesc>Last updated: {formatDate(document?.$updatedAt)}</CardBoxDesc>
        </CardBoxItem>
      </CardBoxBody>
    </CardBox>
  );
};

export { DocumentPage };
