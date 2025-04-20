"use client";
import { ModelsX } from "@/lib/external-sdk";
import { useProjectStore } from "@/lib/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataGrid } from "react-data-grid";

export const TableEditor = () => {
  const sdk = useProjectStore.use.sdk();

  const fetcher = async () => sdk.schema.getTables("public");

  const { data, isPending, isError } = useSuspenseQuery({
    queryKey: ["sc"],
    queryFn: fetcher,
  });

  return (
    <>
      <div className="h-full w-full">
        {isPending && <div>Loading...</div>}
        {isError && <div>Error loading tables</div>}
        {data && data.tables.length && <Table table={data.tables[0]} />}
      </div>
    </>
  );
};

const Table = ({ table }: { table: ModelsX.Table }) => {
  const columns = table.columns.map((c) => ({ key: c.name, name: c.name }));

  const rows: any[] = [];

  return <DataGrid rows={rows} columns={columns} />;
};
