import { CollectionPage } from "@/components/project/schema/single/collection";
import { PropsWithParams } from "@/types";
import React from "react";

export default async function ({
  params,
}: PropsWithParams<{ databaseId: string; collectionId: string }>) {
  const { ...props } = await params;

  return <CollectionPage {...props} />;
}
