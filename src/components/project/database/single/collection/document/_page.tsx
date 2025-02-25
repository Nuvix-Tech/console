"use client";
import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
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
      <CardBox>
        <CardBoxBody>
          <CardBoxItem>
            <CardBoxTitle>
              Document
            </CardBoxTitle>
          </CardBoxItem>
          <CardBoxItem>
            <Column gap="12">
              <Text>
                {collection?.name} - {database?.name}
              </Text>
              <Text>
                {document?.$id}
              </Text>
              <Text>
                {formatDate(document?.$createdAt)}
              </Text>
              <Text>
                {formatDate(document?.$updatedAt)}
              </Text>
            </Column>
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </Column>
  );
};

const MetaData = () => {
  const { document } = getDocumentPageState();
  const { collection } = getCollectionPageState();
  const { database } = getDbPageState();

  return (
    <CardBox>
      <CardBoxBody>
        <CardBoxItem>
          <CardBoxTitle>
            Metadata
          </CardBoxTitle>
        </CardBoxItem>
        <CardBoxItem>
          <Text>
            {formatDate(document?.$createdAt)}
          </Text>
          <Text>
            {formatDate(document?.$updatedAt)}
          </Text>
        </CardBoxItem>
      </CardBoxBody>
    </CardBox>
  );
};

export { DocumentPage };
