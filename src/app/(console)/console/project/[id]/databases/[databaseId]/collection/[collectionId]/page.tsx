import { PropsWithParams } from "@/types";
import React from "react";

export default async function ({
  params,
}: PropsWithParams<{ databaseId: string; collectionId: string }>) {
  const { databaseId, collectionId } = await params;

  return (
    <div>
      <h1>Collection Page</h1>
      <p>Database ID: {databaseId}</p>
      <p>Collection ID: {collectionId}</p>
    </div>
  );
}
