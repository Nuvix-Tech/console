"use client";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { isUndefined } from "lodash";

import { NuvixGrid } from "../grid/NuvixGrid";
import { TableEditorTableStateContextProvider } from "@/lib/store/table";
import { useProjectStore } from "@/lib/store";
import {
  isMaterializedView,
  isTableLike,
  isView,
  Table,
  View,
  MaterializedView,
} from "@/data/table-editor/table-editor-types";
import { PROTECTED_SCHEMAS } from "@/lib/constants";
import { useGetTables } from "@/data/tables/tables-query";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import { useTableEditorQuery } from "@/data/table-editor/table-editor-query";
import { Feedback } from "@nuvix/ui/components";
import SidePanelEditor from "./SidePanelEditor/SidePanelEditor";
import { useSearchQuery } from "@/hooks/useQuery";
import { TableParam } from "@/types";
import DeleteConfirmationDialogs from "./components/_delete_dialog";
import { Code } from "@chakra-ui/react";

// Placeholder component for loading state
const LoadingState = () => <div>Loading...</div>;

// Placeholder component for error/not found state
const TableNotFound = ({ id }: { id: number | undefined }) => (
  <div className="flex items-center justify-center h-full">
    <div className="w-[400px]">
      <Feedback
        title={id ? `Unable to find table with ID ${id}` : "Table ID is missing"}
        description={
          id
            ? "This table might not exist or you may not have permission to view it."
            : "Please select a table."
        }
      />
    </div>
  </div>
);

export const TableEditor = () => {
  const { tableId: tableIdParam, id: projectRef } = useParams<TableParam & { id: string }>();
  const router = useRouter();
  const { project, sdk } = useProjectStore();
  const { selectedSchema } = useQuerySchemaState();
  const { params } = useSearchQuery();

  const tableId = useMemo(() => {
    const parsedId: any = tableIdParam ? parseInt(tableIdParam, 10) : undefined;
    return isNaN(parsedId) ? undefined : parsedId;
  }, [tableIdParam]);

  // Redirect if tableId is invalid or missing after parsing
  if (isUndefined(tableId)) {
    // Redirect to the base editor page if no valid table ID is present
    // Consider if this redirect is always the desired behavior
    if (typeof window !== "undefined") {
      // Ensure router is used client-side
      router.replace(`/project/${projectRef}/editor`);
    }
    return <TableNotFound id={tableId} />; // Show message while redirecting or if redirect fails
  }

  const {
    data: selectedTable,
    isLoading,
    isError,
  } = useTableEditorQuery({
    projectRef: project?.$id,
    sdk,
    id: tableId,
  });

  const getTables = useGetTables({
    projectRef: project?.$id,
    sdk,
  });

  const onTableCreated = useCallback(
    (table: { id: number }) => {
      if (project?.$id) {
        router.push(`/project/${project.$id}/editor/${table.id}`);
      }
    },
    [project?.$id, router],
  );

  const onTableDeleted = useCallback(async () => {
    try {
      const tables = await getTables(selectedSchema);
      const nextTableId = tables.length > 0 ? tables[0].id : undefined;
      const nextUrl = nextTableId
        ? `/project/${projectRef}/editor/${nextTableId}`
        : `/project/${projectRef}/editor`;
      router.push(nextUrl);
    } catch (error) {
      console.error("Failed to fetch tables after deletion:", error);
      // Fallback redirect if fetching tables fails
      router.push(`/project/${projectRef}/editor`);
    }
  }, [getTables, projectRef, router, selectedSchema]);

  // Derived state calculations
  const isViewSelected = useMemo(
    () => isView(selectedTable) || isMaterializedView(selectedTable),
    [selectedTable],
  );
  const isTableSelected = useMemo(() => isTableLike(selectedTable), [selectedTable]);
  const isLocked = useMemo(
    () => PROTECTED_SCHEMAS.includes(selectedTable?.schema ?? ""),
    [selectedTable],
  );

  // --- TODO: Replace hardcoded permissions with actual permission checks ---
  const canEditTables = true; // Example: useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'tables')
  const canEditColumns = true; // Example: useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'columns')
  // ---

  const isReadOnly = !canEditTables && !canEditColumns;
  const canEditViaTableEditor = isTableSelected && !isLocked;
  const editable = !isReadOnly && canEditViaTableEditor;

  const selectedView = params.get("view") || "data";
  const gridKey = `${selectedTable?.schema}_${selectedTable?.name}_${tableId}`; // Include tableId for uniqueness

  // --- Render Logic ---

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || isUndefined(selectedTable)) {
    return <TableNotFound id={tableId} />;
  }

  // Type assertion after checks
  const table = selectedTable as Table | View | MaterializedView;

  return (
    <>
      <TableEditorTableStateContextProvider
        // Key ensures context resets when navigating between different tables
        key={`table-editor-context-${tableId}`}
        projectRef={projectRef}
        table={table}
        editable={editable}
      >
        <NuvixGrid
          key={gridKey}
          gridProps={{ height: "100%" }}
          customHeader={
            (isViewSelected || isTableSelected) && selectedView === "definition" ? (
              <div className="flex items-center space-x-2">
                <p>
                  SQL Definition of <Code className="text-sm">{table.name}</Code>
                </p>
                <p className="text-muted-foreground text-sm">(Read only)</p>
              </div>
            ) : null
          }
        >
          {/* Conditional rendering for table definition can be added here if needed */}
          {/* {(isViewSelected || isTableSelected) && selectedView === 'definition' && (
              <TableDefinition entity={table} />
            )} */}
        </NuvixGrid>

        <SidePanelEditor
          editable={editable}
          selectedTable={isTableLike(table) ? table : undefined}
          onTableCreated={onTableCreated}
        />
        <DeleteConfirmationDialogs
          selectedTable={isTableLike(selectedTable) ? selectedTable : undefined}
          onTableDeleted={onTableDeleted}
        />
      </TableEditorTableStateContextProvider>
    </>
  );
};
