import { PropsWithParams } from "@/types";
import { PropsWithChildren } from "react";
import { CollectionLayout } from "@/components/project/schema/single/collection";

export default async function ({
  children,
  params,
}: PropsWithChildren & PropsWithParams<{ databaseId: string; collectionId: string }>) {
  const props = await params;

  return <CollectionLayout {...props}>{children}</CollectionLayout>;
}
