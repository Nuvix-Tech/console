"use client";
import { PageContainer, PageHeading } from "@/components/others";
import { TablesList } from "./components";
import { useTableEditorStateSnapshot } from "@/lib/store/table-editor";
import { useState } from "react";
import { Entity, isTableLike, postgresTableToEntity } from "@/data/table-editor/table-editor-types";
import { useParams } from "next/navigation";
import { TableEditorTableStateContextProvider } from "@/lib/store/table";
import DeleteConfirmationDialogs from "@/components/editor/components/_delete_dialog";
import SidePanelEditor from "@/components/editor/SidePanelEditor/SidePanelEditor";
import { PostgresTable } from "@nuvix/pg-meta";

export const TablesPage = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const snap = useTableEditorStateSnapshot();
  const [selectedTableToEdit, setSelectedTableToEdit] = useState<Entity>();

  return (
    <>
      <PageContainer>
        <PageHeading
          heading="Tables"
          description="Tables are the basic building blocks of a database. They are used to store data in a structured format, with rows and columns."
        />
        <TablesList
          onAddTable={snap.onAddTable}
          onEditTable={(table) => {
            setSelectedTableToEdit(postgresTableToEntity(table));
            snap.onEditTable();
          }}
          onDeleteTable={(table) => {
            setSelectedTableToEdit(postgresTableToEntity(table));
            snap.onDeleteTable();
          }}
          onDuplicateTable={(table) => {
            setSelectedTableToEdit(postgresTableToEntity(table));
            snap.onDuplicateTable();
          }}
        />
      </PageContainer>
      {projectId !== undefined &&
        selectedTableToEdit !== undefined &&
        isTableLike(selectedTableToEdit) && (
          <TableEditorTableStateContextProvider
            key={`table-editor-table-${selectedTableToEdit.id}`}
            projectRef={projectId}
            table={selectedTableToEdit}
          >
            <DeleteConfirmationDialogs selectedTable={selectedTableToEdit} />
          </TableEditorTableStateContextProvider>
        )}

      <SidePanelEditor includeColumns selectedTable={selectedTableToEdit as PostgresTable} />
    </>
  );
};
