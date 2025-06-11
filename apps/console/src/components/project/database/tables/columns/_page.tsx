"use client";

import DeleteConfirmationDialogs from "@/components/editor/components/_delete_dialog";
import SidePanelEditor from "@/components/editor/SidePanelEditor/SidePanelEditor";
import { PageContainer, PageHeading } from "@/components/others"
import { useTableEditorQuery } from "@/data/table-editor/table-editor-query";
import { isTableLike } from "@/data/table-editor/table-editor-types";
import { useProjectStore } from "@/lib/store";
import { TableEditorTableStateContextProvider } from "@/lib/store/table";
import { useTableEditorStateSnapshot } from "@/lib/store/table-editor"
import { SkeletonText } from "@chakra-ui/react";
import { ColumnList } from "./_list";

export const ColumnsPage = ({ tableId }: { tableId: string }) => {
    const snap = useTableEditorStateSnapshot()
    const id = tableId ? Number(tableId) : undefined
    const { project, sdk } = useProjectStore((s) => s);

    const { data: selectedTable, isLoading } = useTableEditorQuery({
        projectRef: project.$id,
        sdk,
        id,
    })

    return (
        <>
            <PageContainer>
                {isLoading ? (
                    <SkeletonText noOfLines={3} />
                ) : (
                    <PageHeading
                        heading="Columns"
                        description="Columns are the individual fields within a table that store data. Each column has a specific data type and can have constraints such as uniqueness or nullability."
                    />
                )}
                <ColumnList
                    onAddColumn={snap.onAddColumn}
                    onEditColumn={snap.onEditColumn}
                    onDeleteColumn={snap.onDeleteColumn}
                />
            </PageContainer>
            {project.$id !== undefined && selectedTable !== undefined && isTableLike(selectedTable) && (
                <TableEditorTableStateContextProvider
                    key={`table-editor-table-${selectedTable.id}`}
                    projectRef={project?.$id}
                    table={selectedTable}
                >
                    <DeleteConfirmationDialogs selectedTable={selectedTable} />
                    <SidePanelEditor includeColumns selectedTable={selectedTable} />
                </TableEditorTableStateContextProvider>
            )}
        </>
    )
}