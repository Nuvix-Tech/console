import { SchemaLayout } from "@/components/project/schema/_root_layout";
import { PropsWithParams } from "@/types";
import { PropsWithChildren } from "react";

export default async function Layout({
  children,
  params,
}: PropsWithChildren<PropsWithParams<{ schemaId: string }>>) {
  const { schemaId } = await params;

  return <SchemaLayout schemaId={schemaId}>{children}</SchemaLayout>;
}
