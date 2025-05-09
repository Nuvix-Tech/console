import { DatabaseSingleLayout } from "@/components/project/database/single";
import { PropsWithParams } from "@/types";
import React, { PropsWithChildren } from "react";

export default async function ({
  children,
  params,
}: PropsWithChildren & PropsWithParams<{ databaseId: string }>) {
  const props = await params;

  return <DatabaseSingleLayout {...props}>{children}</DatabaseSingleLayout>;
}
