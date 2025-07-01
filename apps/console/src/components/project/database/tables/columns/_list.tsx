"use client";
// import { PermissionAction } from '@supabase/shared-types/out/constants'
import { noop } from "lodash";
import { ChevronLeft, Edit, MoreVertical, Plus, SearchIcon, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button, Code, Input, InputGroup, SkeletonText } from "@chakra-ui/react";

import { CreateButton } from "@/components/others";
import { EmptyState } from "@/components/_empty_state";
import { DataGridProvider, Table } from "@/ui/data-grid";
import { useTableEditorQuery } from "@/data/table-editor/table-editor-query";
import { isTableLike } from "@/data/table-editor/table-editor-types";
// import { useCheckPermissions } from 'hooks/misc/useCheckPermissions'
import { PROTECTED_SCHEMAS } from "@/lib/constants/schemas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nuvix/sui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@nuvix/sui/components/tooltip";
import { useParams } from "next/navigation";
import { useProjectStore } from "@/lib/store";
import ProtectedSchemaWarning from "@/ui/ProtectedSchemaWarning";
// import ProtectedSchemaWarning from '../ProtectedSchemaWarning'

interface ColumnListProps {
  onAddColumn: () => void;
  onEditColumn: (column: any) => void;
  onDeleteColumn: (column: any) => void;
}

const ColumnList = ({
  onAddColumn = noop,
  onEditColumn = noop,
  onDeleteColumn = noop,
}: ColumnListProps) => {
  const { tableId, id: projectId } = useParams<{ tableId: string; id: string }>();
  const id = tableId ? Number(tableId) : undefined;

  const { project, sdk } = useProjectStore((s) => s);
  const {
    data: selectedTable,
    error,
    isError,
    isLoading,
    isSuccess,
    isFetching,
  } = useTableEditorQuery({
    projectRef: projectId,
    sdk,
    id,
  });

  const [filterString, setFilterString] = useState<string>("");
  const isTableEntity = isTableLike(selectedTable);

  const columns =
    (filterString.length === 0
      ? (selectedTable?.columns ?? [])
      : selectedTable?.columns?.filter((column) => column.name.includes(filterString))) ?? [];

  const isLocked = PROTECTED_SCHEMAS.includes(selectedTable?.schema ?? "");
  const canUpdateColumns = true; // useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'columns')

  const hasQuery = !!filterString;

  const tableColumns: ColumnDef<(typeof columns)[number]>[] = [
    {
      header: "Name",
      accessorKey: "name",
      minSize: 180,
      cell({ getValue }) {
        return <p>{getValue<string>()}</p>;
      },
    },
    {
      header: "Description",
      accessorKey: "comment",
      minSize: 200,
      cell({ getValue }) {
        const comment = getValue<string | null>();
        return comment !== null ? (
          <span className="text-sm tex-semibold" title={comment}>
            {comment}
          </span>
        ) : (
          <p className="text-sm tex-semibold">No description</p>
        );
      },
    },
    {
      header: "Data Type",
      accessorKey: "data_type",
      minSize: 120,
      cell({ getValue }) {
        return (
          <Code title={getValue<string>()} className="text-xs text-elipsis line-clamp-1">
            {getValue<string>()}
          </Code>
        );
      },
    },
    {
      header: "Format",
      accessorKey: "format",
      minSize: 120,
      cell({ getValue }) {
        return <Code className="text-xs">{getValue<string>()}</Code>;
      },
    },
    {
      header: "",
      accessorKey: "actions",
      minSize: 60,
      cell({ row }) {
        const column = row.original;
        return (
          <div className="flex justify-end">
            {!isLocked && isTableEntity && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="2xs" className="px-1">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="w-40">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem
                        disabled={!canUpdateColumns}
                        onClick={() => onEditColumn(column)}
                        className="space-x-2 !pointer-events-auto"
                      >
                        <Edit size={12} />
                        <p>Edit column</p>
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    {!canUpdateColumns && (
                      <TooltipContent side="bottom">
                        Additional permissions required to edit column
                      </TooltipContent>
                    )}
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem
                        disabled={!canUpdateColumns || isLocked}
                        onClick={() => onDeleteColumn(column)}
                        className="space-x-2 !pointer-events-auto"
                      >
                        <Trash stroke="red" size={12} />
                        <p>Delete column</p>
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    {!canUpdateColumns && (
                      <TooltipContent side="bottom">
                        Additional permissions required to delete column
                      </TooltipContent>
                    )}
                  </Tooltip>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      },
    },
  ];

  const create = (
    <CreateButton hasPermission={canUpdateColumns} label="Add Column" onClick={onAddColumn} />
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="xs" className="px-2">
            <Link href={`/project/${projectId}/database/tables`}>
              <ChevronLeft size={16} />
            </Link>
          </Button>
          <InputGroup startElement={<SearchIcon size={12} />}>
            <Input
              size="xs"
              placeholder="Filter columns"
              value={filterString}
              onChange={(e) => setFilterString(e.target.value)}
              className="w-52"
            />
          </InputGroup>
        </div>
        {!isLocked && isTableEntity && (
          <Button size="xs" disabled={!canUpdateColumns} onClick={() => onAddColumn()}>
            <Plus />
            New column
          </Button>
        )}
      </div>

      {isLocked && <ProtectedSchemaWarning schema={selectedTable?.schema ?? ""} entity="columns" />}

      <DataGridProvider<(typeof columns)[number]>
        columns={tableColumns}
        data={columns}
        loading={isFetching}
      >
        {isLoading && <SkeletonText noOfLines={4} />}

        <EmptyState
          show={columns.length === 0 && !isFetching && !hasQuery && !isLoading}
          title="No columns found"
          description="No columns have been created yet."
          primaryComponent={create}
        />

        {((isSuccess && columns.length > 0) || hasQuery) && (
          <Table noResults={columns.length === 0 && hasQuery} />
        )}
      </DataGridProvider>
    </div>
  );
};

export { ColumnList };
