import { Key } from "lucide-react";
import { DataGrid, Column } from "react-data-grid";

import { COLUMN_MIN_WIDTH } from "../../constants";
import { ESTIMATED_CHARACTER_PIXEL_WIDTH, getColumnDefaultWidth } from "../../utils/gridColumns";
import { useProjectStore } from "@/lib/store";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { convertByteaToHex } from "@/lib/helpers";
import { cn } from "@nuvix/sui/lib/utils";
import { PostgresTable } from "@nuvix/pg-meta";
import { useTableRowsQuery } from "@/data/table-rows/table-rows-query";
import { gridStyles } from "../grid/Grid";
import { SkeletonText } from "@/components/cui/skeleton";
import { EditorTablePageLink } from "@/data/prefetchers/project.$ref.editor.$id";
import { Button } from "@chakra-ui/react";
import { useParams } from "next/navigation";

interface ReferenceRecordPeekProps {
  table: PostgresTable;
  column: string;
  value: any;
}

export const ReferenceRecordPeek = ({ table, column, value }: ReferenceRecordPeekProps) => {
  const { id: ref } = useParams<{ id: string }>();
  const { project, sdk } = useProjectStore();

  const { data, error, isSuccess, isError, isLoading } = useTableRowsQuery(
    {
      projectRef: project?.$id,
      sdk,
      tableId: table.id,
      filters: [{ column, operator: "=", value }],
      page: 1,
      limit: 10,
    },
    // { placeholderData: },
  );

  const primaryKeys = table.primary_keys.map((x) => x.name);

  const columns = (table?.columns ?? []).map((column) => {
    const columnDefaultWidth = getColumnDefaultWidth({
      dataType: column.data_type,
      format: column.format,
    } as any);
    const columnWidthBasedOnName =
      (column.name.length + column.format.length) * ESTIMATED_CHARACTER_PIXEL_WIDTH;
    const columnWidth =
      columnDefaultWidth < columnWidthBasedOnName ? columnWidthBasedOnName : columnDefaultWidth;
    const isPrimaryKey = primaryKeys.includes(column.name);

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
          <span className="text-xs text-foreground-light font-normal">{column.format}</span>
        </div>
      ),
      renderCell: ({ column: col, row }) => {
        const value = row[col.name as any];
        const formattedValue = column.format === "bytea" ? convertByteaToHex(value) : value;
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
        className="!h-32 rounded-b border-0"
        columns={columns}
        rows={data?.rows ?? []}
        onCellDoubleClick={(_, e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        renderers={{
          noRowsFallback: (
            <div className="w-96 px-2">
              {isLoading && (
                <div className="py-2">
                  <SkeletonText noOfLines={1} />
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
        style={gridStyles}
      />
      <div className="flex items-center justify-end px-2 py-1">
        <EditorTablePageLink
          href={`/project/${ref}/editor/${table.id}?schema=${table.schema}&filter=${column}%3Aeq%3A${value}`}
          projectRef={ref}
          id={String(table.id)}
          filters={[{ column, operator: "=", value: String(value) }]}
        >
          <Button variant="solid" size="sm" as={"span"}>
            Open table
          </Button>
        </EditorTablePageLink>
      </div>
    </>
  );
};
