"use client";
import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { formatDate } from "@/lib/utils";
import { getDocumentPageState } from "@/state/page";
import { Column } from "@/ui/components";
import React from "react";
import { UpdatePermissions } from "./components";
import { DeleteDocument } from "./components/_delete";

const DocumentDetails: React.FC = () => {
  const { document } = getDocumentPageState();

  if (!document) return;

  return (
    <Column gap="20" padding="20" fillWidth>
      <UpdatePermissions />
      <DeleteDocument />
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

export { DocumentDetails };
