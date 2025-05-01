"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";
import { SupabaseGrid } from "../grid/SupabaseGrid";
import { TableEditorTableStateContextProvider } from "@/lib/store/table";
import { useProjectStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { isMaterializedView, isTableLike, isView } from "@/data/table-editor/table-editor-types";
import { PROTECTED_SCHEMAS } from "@/lib/constants";
import { isUndefined } from "lodash";
import { useGetTables } from "@/data/tables/tables-query";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import { useTableEditorQuery } from "@/data/table-editor/table-editor-query";
import { Feedback } from "@nuvix/ui/components";
import SidePanelEditor from "./SidePanelEditor/SidePanelEditor";
import { useSearchQuery } from "@/hooks/useQuery";

export const TableEditor = () => {
  const searchParam = useSearchParams();
  const currentTable = searchParam.get("table");
  const { project, sdk } = useProjectStore();
  const { selectedSchema } = useQuerySchemaState();

  const id = currentTable ? parseInt(currentTable) : undefined;

  if (!id) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-[400px]">
          <Feedback
            variant="danger"
            title="Unable to find your table"
            description="Please select a table from the sidebar to view its details."
          />
        </div>
      </div>
    );
  }

  const { data: selectedTable, isLoading } = useTableEditorQuery({
    projectRef: project?.$id,
    sdk,
    id: id,
  });

  const router = useRouter();
  const canEditTables = true; // useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'tables')
  const canEditColumns = true; //useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'columns')
  const isReadOnly = !canEditTables && !canEditColumns;
  const tabId = undefined;
  const projectRef = project?.$id;
  const { params } = useSearchQuery();
  const selectedView = params.get("view") || "data";

  const getTables = useGetTables({
    projectRef: project?.$id,
    sdk,
  });

  const onTableCreated = useCallback(
    (table: { id: number }) => {
      router.push(`/project/${project.$id}/editor/${table.id}`);
    },
    [project, router],
  );

  const onTableDeleted = useCallback(async () => {
    const tables = await getTables(selectedSchema);
    if (tables.length > 0) {
      router.push(`/project/${projectRef}/editor/${tables[0].id}`);
    } else {
      router.push(`/project/${projectRef}/editor`);
    }
  }, [getTables, projectRef, router, selectedSchema]);

  // NOTE: DO NOT PUT HOOKS AFTER THIS LINE
  if (!projectRef) {
    return (
      <div className="flex flex-col">
        <div className="h-10 bg-dash-sidebar dark:bg-surface-100" />
        <div className="h-9 border-y" />
        <div className="p-2 col-span-full">
          {/* <GenericSkeletonLoader /> */}
          loading...
        </div>
      </div>
    );
  }

  if (isUndefined(selectedTable)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-[400px]">
          <Feedback
            title={`Unable to find your table with ID ${id}`}
            description="This table doesn't exist in your database"
          >
            {/* {isTableEditorTabsEnabled && (
              <Button
                type="default"
                className="mt-2"
                onClick={() => {
                  if (tabId) {
                    handleTabClose({
                      ref: projectRef,
                      id: tabId,
                      router,
                      editor,
                      onClearDashboardHistory,
                    })
                  }
                }}
              >
                Close tab
              </Button>
            )} */}
          </Feedback>
        </div>
      </div>
    );
  }

  const isViewSelected = isView(selectedTable) || isMaterializedView(selectedTable);
  const isTableSelected = isTableLike(selectedTable);
  const isLocked = PROTECTED_SCHEMAS.includes(selectedTable?.schema ?? "");
  const canEditViaTableEditor = isTableSelected && !isLocked;
  const editable = !isReadOnly && canEditViaTableEditor;

  const gridKey = `${selectedTable.schema}_${selectedTable.name}`;

  return (
    <>
      <Suspense fallback={"Loading ....."}>
        <TableEditorTableStateContextProvider
          key={`table-editor-table-${currentTable}`}
          projectRef={project.$id}
          table={selectedTable}
          editable={true}
        >
          <SupabaseGrid
            key={gridKey}
            gridProps={{ height: "100%" }}
            customHeader={
              (isViewSelected || isTableSelected) && selectedView === "definition" ? (
                <div className="flex items-center space-x-2">
                  <p>
                    SQL Definition of <code className="text-sm">{selectedTable.name}</code>{" "}
                  </p>
                  <p className="text-foreground-light text-sm">(Read only)</p>
                </div>
              ) : null
            }
          >
            {/* {(isViewSelected || isTableSelected) && selectedView === 'definition' && (
              <TableDefinition entity={selectedTable} />
            )} */}
          </SupabaseGrid>

          <SidePanelEditor
            editable={editable}
            selectedTable={isTableLike(selectedTable) ? selectedTable : undefined}
            onTableCreated={onTableCreated}
          />
        </TableEditorTableStateContextProvider>
      </Suspense>
    </>
  );
};
