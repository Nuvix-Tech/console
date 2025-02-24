import { PropsWithParams } from "@/types";
import React from "react";

type Props = {
  id: string;
  databaseId: string;
  collectionId: string;
  documentId: string;
};

export default async function ({ params }: PropsWithParams<Props>) {
  const { id, databaseId, collectionId, documentId } = await params;

  return (
    <div>
      <h1>Document Page</h1>
      <p>Project ID: {id}</p>
      <p>Database ID: {databaseId}</p>
      <p>Collection ID: {collectionId}</p>
      <p>Document ID: {documentId}</p>
    </div>
  );
}
