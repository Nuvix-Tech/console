import React from "react";
import { PropsWithParams } from "@/types";
import { ColumnsPage } from "@/components/project/database/tables/columns/_page";

export const metadata = {
  title: "Table Columns",
  description: "Manage your database table's columns.",
};

export default async function TableColumns({ params }: PropsWithParams<{ tableId: string }>) {
  const { tableId } = await params;
  return <ColumnsPage tableId={tableId} />;
}
