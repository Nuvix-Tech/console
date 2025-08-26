import React from "react";
import { DatabaseSinglePage } from "@/components/project/schema/single";
import { PropsWithParams } from "@/types";

export default async function ({ params }: PropsWithParams<{ databaseId: string }>) {
  const { databaseId } = await params;
  return <DatabaseSinglePage databaseId={databaseId} />;
}
