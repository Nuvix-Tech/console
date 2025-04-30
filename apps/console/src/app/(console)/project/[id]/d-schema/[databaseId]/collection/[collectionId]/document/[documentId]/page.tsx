import { DocumentPage } from "@/components/project/database/single/collection/document";
import { PropsWithParams } from "@/types";
import React from "react";

type Props = {
  id: string;
  databaseId: string;
  collectionId: string;
  documentId: string;
};

export default async function ({ params }: PropsWithParams<Props>) {
  const { ...props } = await params;

  return <DocumentPage {...props} />;
}
