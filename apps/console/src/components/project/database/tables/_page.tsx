"use client";
import { useConfirm } from "@nuvix/ui/components";
import { Models } from "@nuvix/console";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button, IconButton, Input, InputGroup, SkeletonText } from "@chakra-ui/react";
import {
  ActionButton,
  DataActionBar,
  DataGridProvider,
  Pagination,
  Search,
  SelectLimit,
  Table,
} from "@/ui/data-grid";
import { CreateButton, PageContainer, PageHeading } from "@/components/others";
import { useProjectStore } from "@/lib/store";
import { EmptyState } from "@/components/_empty_state";
import { useParams } from "next/navigation";
import { CreateTable } from "./components";

import type { PostgresTable } from "@nuvix/pg-meta";
// import { PermissionAction } from '@supabase/shared-types/out/constants'
import { noop } from "lodash";
import {
  Check,
  Columns,
  Copy,
  Edit,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  SearchIcon,
  Table2,
  Trash,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// import AlertError from 'components/ui/AlertError'
import SchemaSelector from "@/ui/SchemaSelector";
// import { GenericSkeletonLoader } from '@/ui/ShimmeringLoader'
import { useDatabasePublicationsQuery } from "@/data/database-publications/database-publications-query";
import { ENTITY_TYPE } from "@/data/entity-types/entity-type-constants";
import { useForeignTablesQuery } from "@/data/foreign-tables/foreign-tables-query";
import { useMaterializedViewsQuery } from "@/data/materialized-views/materialized-views-query";
import { usePrefetchEditorTablePage } from "@/data/prefetchers/project.$ref.editor.$id";
import { useTablesQuery } from "@/data/tables/tables-query";
import { useViewsQuery } from "@/data/views/views-query";
// import { useCheckPermissions } from 'hooks/misc/useCheckPermissions'
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import { PROTECTED_SCHEMAS } from "@/lib/constants/schemas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Label,
  PopoverContent,
  PopoverTrigger,
  Popover,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@nuvix/sui/components";
import { Checkbox } from "@/components/cui/checkbox";
import { formatAllEntities } from "./components/_utils";
import { cn } from "@nuvix/sui/lib/utils";
import { EntityTypeFilter } from "../../table-editor/components/TableEditorMenu";
import ProtectedSchemaWarning from "@/ui/ProtectedSchemaWarning";
// import ProtectedSchemaWarning from '../ProtectedSchemaWarning'

interface TableListProps {
  onAddTable: () => void;
  onEditTable: (table: PostgresTable) => void;
  onDeleteTable: (table: PostgresTable) => void;
  onDuplicateTable: (table: PostgresTable) => void;
}

const TablesPage = ({
  onDuplicateTable = noop,
  onAddTable = noop,
  onEditTable = noop,
  onDeleteTable = noop,
}: Partial<TableListProps>) => {
  const sdk = useProjectStore.use.sdk?.();
  const { id: projectId } = useParams<{ id: string }>();
  const permissions = useProjectStore.use.permissions();
  const confirm = useConfirm();
  const router = useRouter();

  const prefetchEditorTablePage = usePrefetchEditorTablePage();

  const { selectedSchema, setSelectedSchema } = useQuerySchemaState();

  const [filterString, setFilterString] = useState<string>("");
  const [visibleTypes, setVisibleTypes] = useState<string[]>(Object.values(ENTITY_TYPE));
  const canUpdateTables = true; // useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'tables')

  const hasQuery = !!filterString;

  const {
    data: tables,
    error: tablesError,
    isError: isErrorTables,
    isPending: isLoadingTables,
    isSuccess: isSuccessTables,
    isFetching: isFetchingTables,
  } = useTablesQuery(
    {
      projectRef: projectId,
      sdk,
      schema: selectedSchema,
      sortByProperty: "name",
      includeColumns: true,
    },
    {
      select(tables) {
        return filterString.length === 0
          ? tables
          : tables.filter((table) => table.name.toLowerCase().includes(filterString.toLowerCase()));
      },
    },
  );

  const {
    data: views,
    error: viewsError,
    isError: isErrorViews,
    isPending: isLoadingViews,
    isSuccess: isSuccessViews,
    isFetching: isFetchingViews,
  } = useViewsQuery(
    {
      projectRef: projectId,
      sdk,
      schema: selectedSchema,
    },
    {
      select(views) {
        return filterString.length === 0
          ? views
          : views.filter((view) => view.name.toLowerCase().includes(filterString.toLowerCase()));
      },
    },
  );

  const {
    data: materializedViews,
    error: materializedViewsError,
    isError: isErrorMaterializedViews,
    isPending: isLoadingMaterializedViews,
    isSuccess: isSuccessMaterializedViews,
    isFetching: isFetchingMaterializedViews,
  } = useMaterializedViewsQuery(
    {
      projectRef: projectId,
      sdk,
      schema: selectedSchema,
    },
    {
      select(materializedViews) {
        return filterString.length === 0
          ? materializedViews
          : materializedViews.filter((view) =>
              view.name.toLowerCase().includes(filterString.toLowerCase()),
            );
      },
    },
  );

  const {
    data: foreignTables,
    error: foreignTablesError,
    isError: isErrorForeignTables,
    isPending: isLoadingForeignTables,
    isSuccess: isSuccessForeignTables,
    isFetching: isFetchingForeignTables,
  } = useForeignTablesQuery(
    {
      projectRef: projectId,
      sdk,
      schema: selectedSchema,
    },
    {
      select(foreignTables) {
        return filterString.length === 0
          ? foreignTables
          : foreignTables.filter((table) =>
              table.name.toLowerCase().includes(filterString.toLowerCase()),
            );
      },
    },
  );

  const { data: publications } = useDatabasePublicationsQuery({
    projectRef: projectId,
    sdk,
  });

  const realtimePublication = (publications ?? []).find(
    (publication: any) => publication.name === "supabase_realtime",
  );

  const entities = formatAllEntities({ tables, views, materializedViews, foreignTables }).filter(
    (x) => visibleTypes.includes(x.type),
  );

  const isLocked = PROTECTED_SCHEMAS.includes(selectedSchema);

  const error = tablesError || viewsError || materializedViewsError || foreignTablesError;
  const isError = isErrorTables || isErrorViews || isErrorMaterializedViews || isErrorForeignTables;
  const isLoading =
    isLoadingTables || isLoadingViews || isLoadingMaterializedViews || isLoadingForeignTables;
  const isSuccess =
    isSuccessTables && isSuccessViews && isSuccessMaterializedViews && isSuccessForeignTables;
  const isFetching =
    isFetchingTables && isFetchingViews && isFetchingMaterializedViews && isFetchingForeignTables;

  const formatTooltipText = (entityType: string) => {
    return Object.entries(ENTITY_TYPE)
      .find(([, value]) => value === entityType)?.[0]
      ?.toLowerCase()
      ?.split("_")
      ?.join(" ");
  };

  const path = `/project/${projectId}/database/${projectId}/tables`;

  const columns: ColumnDef<(typeof entities)[number]>[] = [
    {
      header: "Name",
      accessorKey: "name",
      minSize: 180,
      cell({ row }) {
        const x = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                {x.type === ENTITY_TYPE.TABLE ? (
                  <Table2 size={15} strokeWidth={1.5} className="text-foreground-lighter" />
                ) : x.type === ENTITY_TYPE.VIEW ? (
                  <Eye size={15} strokeWidth={1.5} className="text-foreground-lighter" />
                ) : (
                  <div
                    className={cn(
                      "flex items-center justify-center text-xs h-4 w-4 rounded-[2px] font-bold",
                      x.type === ENTITY_TYPE.FOREIGN_TABLE && "text-yellow-900 bg-yellow-500",
                      x.type === ENTITY_TYPE.MATERIALIZED_VIEW && "text-purple-1000 bg-purple-500",
                      // [Alaister]: tables endpoint doesn't distinguish between tables and partitioned tables
                      // once we update the endpoint to include partitioned tables, we can uncomment this
                      // x.type === ENTITY_TYPE.PARTITIONED_TABLE &&
                      //   'text-foreground-light bg-border-stronger'
                    )}
                  >
                    {Object.entries(ENTITY_TYPE)
                      .find(([, value]) => value === x.type)?.[0]?.[0]
                      ?.toUpperCase()}
                  </div>
                )}
              </TooltipTrigger>
              <TooltipContent side="bottom" className="capitalize">
                {formatTooltipText(x.type)}
              </TooltipContent>
            </Tooltip>
            {x.name.length > 20 ? (
              <Tooltip disableHoverableContent={true}>
                <TooltipTrigger
                  asChild
                  className="max-w-[95%] overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <p>{x.name}</p>
                </TooltipTrigger>

                <TooltipContent side="bottom">{x.name}</TooltipContent>
              </Tooltip>
            ) : (
              <p>{x.name}</p>
            )}
          </div>
        );
      },
    },
    {
      header: "Description",
      accessorKey: "comment",
      minSize: 200,
      cell({ getValue }) {
        const comment = getValue<string | null>();
        return comment !== null ? (
          <span className="lg:max-w-48 truncate inline-block" title={comment}>
            {comment}
          </span>
        ) : (
          <p className="text-border-stronger">No description</p>
        );
      },
    },
    {
      header: "Rows (Estimated)",
      accessorKey: "rows",
      minSize: 160,
    },
    {
      header: "Size (Estimated)",
      accessorKey: "size",
      minSize: 100,
    },
    {
      header: "",
      accessorKey: "columns",
      minSize: 200,
      cell({ row }) {
        const x = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              asChild
              size={"2xs"}
              variant="outline"
              className="whitespace-nowrap hover:border-muted"
            >
              <Link href={`/project/${projectId}/database/tables/${x.id}`}>
                {x.columns.length} columns
                <Columns size={14} className="text-muted-foreground" />
              </Link>
            </Button>

            {!isLocked && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} size={"2xs"} className="px-1">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="max-w-52">
                  <DropdownMenuItem
                    className="flex items-center space-x-2"
                    onClick={() => router.push(`/project/${projectId}/editor/${x.id}`)}
                    onMouseEnter={() =>
                      prefetchEditorTablePage({ id: x.id ? String(x.id) : undefined })
                    }
                  >
                    <Eye size={12} />
                    <p>View in Table Editor</p>
                  </DropdownMenuItem>

                  {x.type === ENTITY_TYPE.TABLE && (
                    <>
                      <DropdownMenuSeparator />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem
                            className="!pointer-events-auto"
                            disabled={!canUpdateTables}
                            onClick={() => {
                              if (canUpdateTables) onEditTable(x);
                            }}
                          >
                            <Edit size={12} />
                            <p>Edit table</p>
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        {!canUpdateTables && (
                          <TooltipContent side="left">
                            You need additional permissions to edit this table
                          </TooltipContent>
                        )}
                      </Tooltip>
                      <DropdownMenuItem
                        key="duplicate-table"
                        className="space-x-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (canUpdateTables) {
                            onDuplicateTable(x);
                          }
                        }}
                      >
                        <Copy size={12} />
                        <span>Duplicate Table</span>
                      </DropdownMenuItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem
                            disabled={!canUpdateTables || isLocked}
                            className="!pointer-events-auto "
                            onClick={() => {
                              if (canUpdateTables && !isLocked) {
                                onDeleteTable({
                                  ...x,
                                  schema: selectedSchema,
                                });
                              }
                            }}
                          >
                            <Trash stroke="red" size={12} />
                            <p>Delete table</p>
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        {!canUpdateTables && (
                          <TooltipContent side="left">
                            You need additional permissions to delete tables
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      },
    },
  ];

  const handleToggleEntityType = (value: string) => {
    setVisibleTypes((prev) =>
      prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value],
    );
  };

  const handleSelectOnlyEntityType = (value: string) => {
    setVisibleTypes([value]);
  };

  const onDelete = async (values: Models.Collection[]) => {
    if (
      await confirm({
        title: "Delete Collection",
        description: `Are you sure you want to delete ${values.length} collection(s)?`,
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      // setDeleting(true);
      // const ids = values.map((v) => v.$id);
      // if (!sdk) return;
      // await Promise.all(
      //   ids.map(async (id) => {
      //     try {
      //       await sdk.databases.deleteCollection(database?.name!, id);
      //     } catch (e) {
      //       addToast({
      //         message: `Error deleting collection ${id}`,
      //         variant: "danger",
      //       });
      //     }
      //   }),
      // ).then((v) =>
      //   addToast({
      //     message: `Successfully deleted ${ids.length} collection(s)`,
      //     variant: "success",
      //   }),
      // );
      // await refetch();
    }
  };

  const create = (
    <CreateButton
      hasPermission={true}
      label="Create Table"
      component={CreateTable}
      // extraProps={{ refetch }}
    />
  );

  return (
    <PageContainer>
      <PageHeading
        heading="Tables"
        description="Tables are the basic building blocks of a database. They are used to store data in a structured format, with rows and columns."
        // right={create}
      />

      <div className="flex flex-col lg:flex-row lg:items-center gap-2 flex-wrap">
        <div className="flex gap-2 items-center">
          <SchemaSelector
            className="flex-grow lg:flex-grow-0 w-[180px]"
            size="s"
            showError={false}
            selectedSchemaName={selectedSchema}
            onSelectSchema={setSelectedSchema}
          />
          <EntityTypeFilter
            visibleTypes={visibleTypes}
            toggleType={handleToggleEntityType}
            selectOnlyType={handleSelectOnlyEntityType}
          />
        </div>
        <div className="flex flex-grow justify-between gap-2 items-center">
          <InputGroup startElement={<SearchIcon size={12} />}>
            <Input
              size="xs"
              className="!flex-grow lg:!flex-grow-0 !w-52"
              placeholder="Search for a table"
              value={filterString}
              onChange={(e) => setFilterString(e.target.value)}
            />
          </InputGroup>

          {!isLocked && (
            <Button
              className="w-auto ml-auto"
              size={"xs"}
              disabled={false}
              onClick={() => onAddTable()}
              // tooltip={{
              //   content: {
              //     side: 'bottom',
              //     text: !canUpdateTables
              //       ? 'You need additional permissions to create tables'
              //       : undefined,
              //   },
              // }}
            >
              <Plus />
              New table
            </Button>
          )}
        </div>
      </div>

      {isLocked && <ProtectedSchemaWarning schema={selectedSchema} entity="tables" />}

      {/* {isLoading && <GenericSkeletonLoader />}

      {isError && <AlertError error={error} subject="Failed to retrieve tables" />} */}

      <DataGridProvider<(typeof entities)[0]>
        columns={columns}
        data={entities}
        loading={isFetching}
      >
        {isLoading && <SkeletonText noOfLines={4} />}

        <EmptyState
          show={entities.length === 0 && !isFetching && !hasQuery && !isLoading}
          title="No tables found"
          description="No tables have been created yet."
          primaryComponent={create}
        />

        {((isSuccess && entities.length > 0) || hasQuery) && (
          <>
            <Table noResults={entities.length === 0 && hasQuery} />
            {/* <HStack justifyContent="space-between" alignItems="center">
              <SelectLimit />
              <Pagination />
            </HStack> */}
          </>
        )}

        {/* {canDeleteCollections && (
          <DataActionBar
            actions={
              <>
                <ActionButton<Models.Collection> variant="danger" onClick={onDelete}>
                  Delete
                </ActionButton>
              </>
            }
          />
        )} */}
      </DataGridProvider>
    </PageContainer>
  );
};

export { TablesPage };
