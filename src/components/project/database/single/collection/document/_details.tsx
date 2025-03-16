"use client";
import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { formatDate } from "@/lib/utils";
import React from "react";
import { UpdatePermissions } from "./components";
import { DeleteDocument } from "./components/_delete";
import { PageContainer } from "@/components/others";
import { useDocumentStore } from "@/lib/store";

const DocumentDetails: React.FC = () => {
  const document = useDocumentStore.use.document?.();

  if (!document) return;

  return (
    <PageContainer>
      <UpdatePermissions />
      <DeleteDocument />
    </PageContainer>
  );
};

const MetaData = () => {
  const document = useDocumentStore.use.document?.();

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

export { DocumentDetails };
