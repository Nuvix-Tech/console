import { DatabasePage } from "@/components/project/database";
import { PropsWithParams } from "@/types";
import React from "react";

export default async function ({ params }: PropsWithParams<{ databaseId: string }>) {
  return <DatabasePage />;
}
