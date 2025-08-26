import { PropsWithParams } from "@/types";
import { PropsWithChildren, Suspense } from "react";
import { DocumentLayout } from "@/components/project/schema/single/collection/document";

type Props = {
  id: string;
  databaseId: string;
  collectionId: string;
  documentId: string;
};

export default async function ({ children, params }: PropsWithChildren & PropsWithParams<Props>) {
  const props = await params;

  return <DocumentLayout {...props}>{children}</DocumentLayout>;
}
