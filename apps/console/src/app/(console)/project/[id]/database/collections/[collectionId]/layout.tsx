import { PropsWithParams } from "@/types";
import { PropsWithChildren } from "react";
import { CollectionLayout } from "@/components/project/database/collections/collection";

export default async function ({
  children,
  params,
}: PropsWithChildren & PropsWithParams<{ collectionId: string }>) {
  const props = await params;

  return <CollectionLayout {...props}>{children}</CollectionLayout>;
}
