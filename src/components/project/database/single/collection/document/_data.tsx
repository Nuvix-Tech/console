"use client";
import { getCollectionPageState, getDocumentPageState } from "@/state/page";
import { DataMapper } from "./components";
import { Column } from "@/ui/components";

export const DocumentData = () => {
  const { document } = getDocumentPageState();
  const { collection } = getCollectionPageState();

  if (!document || !collection) return;

  return (
    <>
      <Column gap="20" paddingX="20">
        <DataMapper attributes={collection.attributes as any} document={document} />
      </Column>
    </>
  );
};
