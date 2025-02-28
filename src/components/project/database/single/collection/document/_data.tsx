"use client";
import { getCollectionPageState, getDocumentPageState } from "@/state/page";
import { DataMapper } from "./components";

export const DocumentData = () => {
  const { document } = getDocumentPageState();
  const { collection } = getCollectionPageState();

  if (!document || !collection) return;

  return (
    <>
      {JSON.stringify(document)}
      <DataMapper attributes={collection.attributes as any} document={document} />
    </>
  );
};
