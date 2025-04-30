import React, { Suspense } from "react";
import { useGrid } from "./_store";
import { useProjectStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { GridHeader } from "./_header";
import { Table } from "../components/_table";

interface NuvixGridProps {
  table: string;
  className?: string;
}

export const NuvixGrid: React.FC<NuvixGridProps> = ({ className, table }) => {
  const {} = useGrid();

  const sdk = useProjectStore.use.sdk();
  const fetcher = async () => sdk.schema.getTable(table, "public");

  const { data, isPending, isError } = useQuery({
    queryKey: ["table", table],
    queryFn: fetcher,
  });

  return (
    <>
      <div className="flex flex-col h-full w-full p-4 overflow-hidden">
        <GridHeader />
        {isPending && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-500">Loading tables...</div>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center h-full bg-red-50 rounded-md p-6">
            <div className="text-red-500">Error loading tables. Please try again.</div>
          </div>
        )}

        {data && (
          <div className="h-full w-full">
            <Suspense fallback={<div>Loading table...</div>}>
              <Table table={data} />
            </Suspense>
          </div>
        )}
      </div>
    </>
  );
};
