import { Key } from "lucide-react";
import { DataGrid, Column } from "react-data-grid";

import { COLUMN_MIN_WIDTH } from "../../constants";
import { getColumnDefaultWidth, internalAttributes } from "../../utils/gridColumns";
import { useProjectStore } from "@/lib/store";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { cn } from "@nuvix/sui/lib/utils";
import { gridStyles } from "../grid/Grid";
import { SkeletonText } from "@nuvix/cui/skeleton";
import { Button } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import type { Models } from "@nuvix/console";
import { useCollectionDocumentsQuery } from "@/data/collections";
import { SmartLink } from "@nuvix/ui/components";

interface ReferenceRecordPeekProps {
  collection: Models.Collection;
  column: Models.AttributeRelationship;
  value: any;
}

export const ReferenceRecordPeek = ({ collection, column, value }: ReferenceRecordPeekProps) => {
  const { id: ref } = useParams<{ id: string }>();
  const { project, sdk } = useProjectStore();

  const { data, error, isSuccess, isError, isLoading } = useCollectionDocumentsQuery(
    {
      projectRef: project?.$id,
      sdk,
      collection,
      schema: collection.$schema,
      filters: [
        { column: "$id", operator: "contains", value: Array.isArray(value) ? value : [value] },
      ],
      page: 1,
      limit: 10,
    },
    // { placeholderData: },
  );

  const columns = (
    [
      internalAttributes[0],
      ...collection.attributes,
      ...internalAttributes.slice(1),
    ] as unknown as (Models.AttributeString & {
      idx?: number;
      isPrimaryKey?: boolean;
      encrypted?: boolean;
      internal?: boolean;
    })[]
  ).map((column) => {
    const columnDefaultWidth = getColumnDefaultWidth(column);
    const rawSize = typeof column.size === "number" ? column.size : columnDefaultWidth;
    // clamp size to be strictly below 500
    const columnSize = Math.min(rawSize, columnDefaultWidth);
    const columnWidth = Math.max(columnDefaultWidth, columnSize);

    const res: Column<any> = {
      key: column.key,
      name: column.key,
      resizable: false,
      draggable: false,
      sortable: false,
      width: columnWidth,
      minWidth: COLUMN_MIN_WIDTH,
      headerCellClass: "outline-none !shadow-none",
      renderHeaderCell: () => (
        <div className="flex h-full items-center gap-x-2">
          {column.isPrimaryKey && (
            <Tooltip>
              <TooltipTrigger>
                <Key size={14} strokeWidth={2} className="brand-on-background-weak rotate-45" />
              </TooltipTrigger>
              <TooltipContent side="bottom">Primary key</TooltipContent>
            </Tooltip>
          )}
          <span className="text-xs truncate">{column.key}</span>
          <span className="text-xs text-muted-foreground font-normal">{column.type}</span>
        </div>
      ),
      renderCell: ({ column: col, row }) => {
        const value = row[col.key as any];
        return (
          <div
            className={cn(
              "flex items-center h-full w-full whitespace-pre",
              value === null && "text-muted-foreground",
            )}
          >
            {value === null ? "NULL" : value}
          </div>
        );
      },
    };
    return res;
  });

  return (
    <>
      <p className="px-2 py-2 text-xs text-muted-foreground border-b">
        Related documents from{" "}
        <span className="text-foreground">
          {collection.$schema}.{collection.name}
        </span>
        :
      </p>
      <DataGrid
        className="!h-32 rounded-b border-0"
        columns={columns}
        rows={data?.documents ?? []}
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
                <p className="text-muted-foreground">
                  Failed to find related document(s): {error.message}
                </p>
              )}
              {isSuccess && <p className="text-muted-foreground">No results were returned</p>}
            </div>
          ),
        }}
        style={gridStyles}
      />
      <div className="flex items-center justify-end px-2 py-1">
        <SmartLink
          href={`/project/${ref}/collections/${collection.$id}?docSchema=${collection.$schema}&filter=${column.key}%3Aequal%3A${value}`}
        >
          <Button variant="solid" size="xs" as={"span"}>
            Open collection
          </Button>
        </SmartLink>
      </div>
    </>
  );
};
