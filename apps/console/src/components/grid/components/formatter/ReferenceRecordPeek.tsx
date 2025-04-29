import { Key } from "lucide-react";
import { DataGrid, Column } from "react-data-grid";

// import { useParams } from "common";
import { COLUMN_MIN_WIDTH } from "../../constants";
import { ESTIMATED_CHARACTER_PIXEL_WIDTH, getColumnDefaultWidth } from "../../utils/gridColumns";
// import { EditorTablePageLink } from "data/prefetchers/project.$ref.editor.$id";
// import { useTableRowsQuery } from "data/table-rows/table-rows-query";
// import { useSelectedProject } from "hooks/misc/useSelectedProject";
// import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from "ui";
// import ShimmeringLoader from "ui-patterns/ShimmeringLoader";
import { ModelsX } from "@/lib/external-sdk";
import { useProjectStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { convertByteaToHex } from "@/lib/helpers";
import { cn } from "@nuvix/sui/lib/utils";
import { Button } from "@/ui/components";

interface ReferenceRecordPeekProps {
  table: ModelsX.Table;
  column: string;
  value: any;
}

export const ReferenceRecordPeek = ({ table, column, value }: ReferenceRecordPeekProps) => {
  // const { ref } = useParams();
  const { project, sdk } = useProjectStore();

  const { data, error, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["table-for-rows", project.$id, table, column],
    queryFn: async () => {
      return sdk.schema.getRows(table.name, table.schema);
    },
  });

  const columns = (table?.columns ?? []).map((column) => {
    const columnDefaultWidth = getColumnDefaultWidth({
      dataType: column.type,
      format: column.type, //format
    } as any);
    const columnWidthBasedOnName =
      (column.name.length + column.type.length) * ESTIMATED_CHARACTER_PIXEL_WIDTH; //format
    const columnWidth =
      columnDefaultWidth < columnWidthBasedOnName ? columnWidthBasedOnName : columnDefaultWidth;
    const isPrimaryKey = column.primary_key;

    const res: Column<any> = {
      key: column.name,
      name: column.name,
      resizable: false,
      draggable: false,
      sortable: false,
      width: columnWidth,
      minWidth: COLUMN_MIN_WIDTH,
      headerCellClass: "outline-none !shadow-none",
      renderHeaderCell: () => (
        <div className="flex h-full items-center justify-center gap-x-2">
          {isPrimaryKey && (
            <Tooltip>
              <TooltipTrigger>
                <Key size={14} strokeWidth={2} className="text-brand rotate-45" />
              </TooltipTrigger>
              <TooltipContent side="bottom">Primary key</TooltipContent>
            </Tooltip>
          )}
          <span className="text-xs truncate">{column.name}</span>
          <span className="text-xs text-foreground-light font-normal">{column.type}</span> //format
        </div>
      ),
      renderCell: ({ column: col, row }) => {
        const value = row[col.name as any];
        const formattedValue = column.type === "bytea" ? convertByteaToHex(value) : value; //format
        return (
          <div
            className={cn(
              "flex items-center h-full w-full whitespace-pre",
              formattedValue === null && "text-foreground-lighter",
            )}
          >
            {formattedValue === null ? "NULL" : formattedValue}
          </div>
        );
      },
    };
    return res;
  });

  return (
    <>
      <p className="px-2 py-2 text-xs text-foreground-light border-b">
        Referencing record from{" "}
        <span className="text-foreground">
          {table.schema}.{table.name}
        </span>
        :
      </p>
      <DataGrid
        className="h-32 rounded-b border-0"
        columns={columns}
        rows={data ?? []}
        onCellDoubleClick={(_, e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        renderers={{
          noRowsFallback: (
            <div className="w-96 px-2">
              {isLoading && (
                <div className="py-2">
                  {/* <ShimmeringLoader /> */}
                  loading ######
                </div>
              )}
              {isError && (
                <p className="text-foreground-light">
                  Failed to find referencing row: {error.message}
                </p>
              )}
              {isSuccess && <p className="text-foreground-light">No results were returned</p>}
            </div>
          ),
        }}
      />
      <div className="flex items-center justify-end px-2 py-1">
        {/* <EditorTablePageLink
          href={`/project/${ref}/editor/${table.id}?schema=${table.schema}&filter=${column}%3Aeq%3A${value}`}
          projectRef={ref}
          id={String(table.id)}
          filters={[{ column, operator: "=", value: String(value) }]}
        > */}
        <Button type="default">Open table</Button>
        {/* </EditorTablePageLink> */}
      </div>
    </>
  );
};
