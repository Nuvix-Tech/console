import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { useTableFilter } from "@/components/grid/hooks/useTableFilter";
import type { SupaRow } from "@/components/grid/types";
import { useDatabaseColumnDeleteMutation } from "@/data/database-columns/database-column-delete-mutation";
import { Table, PartitionedTable } from "@/data/table-editor/table-editor-types";
import { useTableRowDeleteAllMutation } from "@/data/table-rows/table-row-delete-all-mutation";
import { useTableRowDeleteMutation } from "@/data/table-rows/table-row-delete-mutation";
import { useTableRowTruncateMutation } from "@/data/table-rows/table-row-truncate-mutation";
import { useTableDeleteMutation } from "@/data/tables/table-delete-mutation";
// import { useGetImpersonatedRoleState } from 'state/role-impersonation-state'
import { AlertDescription, AlertTitle, Alert } from "@nuvix/sui/components/alert";
import { useProjectStore } from "@/lib/store";
import { useTableEditorStateSnapshot } from "@/lib/store/table-editor";
import ConfirmationModal from "./_confim_dialog";
import { Button, Checkbox } from "@nuvix/ui/components";

export type DeleteConfirmationDialogsProps = {
  selectedTable?: Table | PartitionedTable;
  onTableDeleted?: () => void;
};

const DeleteConfirmationDialogs = ({
  selectedTable,
  onTableDeleted,
}: DeleteConfirmationDialogsProps) => {
  const { project, sdk } = useProjectStore((state) => state);
  const snap = useTableEditorStateSnapshot();
  const { filters, onApplyFilters } = useTableFilter();

  const removeDeletedColumnFromFiltersAndSorts = ({
    columnName,
  }: {
    ref?: string;
    tableName?: string;
    schema?: string;
    columnName: string;
  }) => {
    onApplyFilters(filters.filter((filter) => filter.column !== columnName));
  };

  const { mutate: deleteColumn } = useDatabaseColumnDeleteMutation({
    onSuccess: () => {
      if (!(snap.confirmationDialog?.type === "column")) return;
      const selectedColumnToDelete = snap.confirmationDialog.column;
      removeDeletedColumnFromFiltersAndSorts({ columnName: selectedColumnToDelete.name });
      toast.success(`Successfully deleted column "${selectedColumnToDelete.name}"`);
    },
    onError: (error) => {
      if (!(snap.confirmationDialog?.type === "column")) return;
      const selectedColumnToDelete = snap.confirmationDialog.column;
      toast.error(`Failed to delete ${selectedColumnToDelete!.name}: ${error.message}`);
    },
    onSettled: () => {
      snap.closeConfirmationDialog();
    },
  });
  const { mutate: deleteTable } = useTableDeleteMutation({
    onSuccess: async () => {
      toast.success(`Successfully deleted table "${selectedTable?.name}"`);
      onTableDeleted?.();
    },
    onError: (error) => {
      toast.error(`Failed to delete ${selectedTable?.name}: ${error.message}`);
    },
    onSettled: () => {
      snap.closeConfirmationDialog();
    },
  });

  const { mutate: deleteRows } = useTableRowDeleteMutation({
    onSuccess: () => {
      if (snap.confirmationDialog?.type === "row") {
        snap.confirmationDialog.callback?.();
      }
      toast.success(`Successfully deleted selected row(s)`);
    },
    onSettled: () => {
      snap.closeConfirmationDialog();
    },
  });

  const { mutate: deleteAllRows } = useTableRowDeleteAllMutation({
    onSuccess: () => {
      if (snap.confirmationDialog?.type === "row") {
        snap.confirmationDialog.callback?.();
      }
      toast.success(`Successfully deleted selected rows`);
    },
    onError: (error) => {
      toast.error(`Failed to delete rows: ${error.message}`);
    },
    onSettled: () => {
      snap.closeConfirmationDialog();
    },
  });

  const { mutate: truncateRows } = useTableRowTruncateMutation({
    onSuccess: () => {
      if (snap.confirmationDialog?.type === "row") {
        snap.confirmationDialog.callback?.();
      }
      toast.success(`Successfully deleted all rows from table`);
    },
    onError: (error) => {
      toast.error(`Failed to delete rows: ${error.message}`);
    },
    onSettled: () => {
      snap.closeConfirmationDialog();
    },
  });

  const isAllRowsSelected =
    snap.confirmationDialog?.type === "row" ? snap.confirmationDialog.allRowsSelected : false;
  const numRows =
    snap.confirmationDialog?.type === "row"
      ? snap.confirmationDialog.allRowsSelected
        ? (snap.confirmationDialog.numRows ?? 0)
        : snap.confirmationDialog.rows.length
      : 0;

  const isDeleteWithCascade =
    snap.confirmationDialog?.type === "column" || snap.confirmationDialog?.type === "table"
      ? snap.confirmationDialog.isDeleteWithCascade
      : false;

  const onConfirmDeleteColumn = async () => {
    if (!(snap.confirmationDialog?.type === "column")) return;
    if (project === undefined) return;

    const selectedColumnToDelete = snap.confirmationDialog.column;
    if (selectedColumnToDelete === undefined) return;

    deleteColumn({
      id: selectedColumnToDelete.id,
      cascade: isDeleteWithCascade,
      projectRef: project.$id,
      sdk,
      table: selectedTable,
    });
  };

  const onConfirmDeleteTable = async () => {
    if (!(snap.confirmationDialog?.type === "table")) return;
    const selectedTableToDelete = selectedTable;

    if (selectedTableToDelete === undefined) return;

    deleteTable({
      projectRef: project?.$id!,
      sdk,
      schema: selectedTableToDelete.schema,
      id: selectedTableToDelete.id,
      cascade: isDeleteWithCascade,
    });
  };

  const getImpersonatedRoleState = () => {
    return { role: undefined };
  }; // useGetImpersonatedRoleState()

  const onConfirmDeleteRow = async () => {
    if (!project) return console.error("Project ref is required");
    if (!selectedTable) return console.error("Selected table required");
    if (snap.confirmationDialog?.type !== "row") return;
    const selectedRowsToDelete = snap.confirmationDialog.rows;

    if (snap.confirmationDialog.allRowsSelected) {
      if (filters.length === 0) {
        if (getImpersonatedRoleState().role !== undefined) {
          snap.closeConfirmationDialog();
          return toast.error("Table truncation is not supported when impersonating a role");
        }

        truncateRows({
          projectRef: project.$id,
          sdk,
          table: selectedTable,
        });
      } else {
        deleteAllRows({
          projectRef: project.$id,
          sdk,
          table: selectedTable as any,
          filters,
          roleImpersonationState: getImpersonatedRoleState(),
        });
      }
    } else {
      deleteRows({
        projectRef: project.$id,
        sdk,
        table: selectedTable,
        rows: selectedRowsToDelete as SupaRow[],
        roleImpersonationState: getImpersonatedRoleState(),
      });
    }
  };

  return (
    <>
      <ConfirmationModal
        variant="destructive"
        visible={snap.confirmationDialog?.type === "column"}
        title={`Confirm deletion of column "${
          snap.confirmationDialog?.type === "column" && snap.confirmationDialog.column.name
        }"`}
        confirmLabel="Delete"
        confirmLabelLoading="Deleting"
        onCancel={() => {
          snap.closeConfirmationDialog();
        }}
        onConfirm={onConfirmDeleteColumn}
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground-light">
            Are you sure you want to delete the selected column? This action cannot be undone.
          </p>
          <Checkbox
            label="Drop column with cascade?"
            description="Deletes the column and its dependent objects"
            isChecked={isDeleteWithCascade}
            onToggle={() => snap.toggleConfirmationIsWithCascade()}
          />
          {isDeleteWithCascade && (
            <Alert
              variant="warning"
              title="Warning: Dropping with cascade may result in unintended consequences"
            >
              <AlertTitle>
                All dependent objects will be removed, as will any objects that depend on them,
                recursively.
              </AlertTitle>
              <AlertDescription>
                <Button
                  asChild
                  size="s"
                  variant="secondary"
                  prefixIcon={<ExternalLink size={14} />}
                >
                  <Link
                    href="https://www.postgresql.org/docs/current/ddl-depend.html"
                    target="_blank"
                    rel="noreferrer"
                  >
                    About dependency tracking
                  </Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        variant={"destructive"}
        // size="small"
        visible={snap.confirmationDialog?.type === "table"}
        title={
          <span className="break-words">{`Confirm deletion of table "${selectedTable?.name}"`}</span>
        }
        confirmLabel="Delete"
        confirmLabelLoading="Deleting"
        onCancel={() => {
          snap.closeConfirmationDialog();
        }}
        onConfirm={onConfirmDeleteTable}
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground-light">
            Are you sure you want to delete the selected table? This action cannot be undone.
          </p>
          <Checkbox
            label="Drop table with cascade?"
            description="Deletes the table and its dependent objects"
            isChecked={isDeleteWithCascade}
            onToggle={() => snap.toggleConfirmationIsWithCascade(!isDeleteWithCascade)}
          />
          {isDeleteWithCascade && (
            <Alert variant="warning">
              <AlertTitle>
                Warning: Dropping with cascade may result in unintended consequences
              </AlertTitle>
              <AlertDescription>
                All dependent objects will be removed, as will any objects that depend on them,
                recursively.
              </AlertDescription>
              <AlertDescription className="mt-4">
                <Button
                  asChild
                  size="s"
                  variant="secondary"
                  prefixIcon={<ExternalLink size={14} />}
                >
                  <Link
                    href="https://www.postgresql.org/docs/current/ddl-depend.html"
                    target="_blank"
                    rel="noreferrer"
                  >
                    About dependency tracking
                  </Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        variant={"destructive"}
        // size="small"
        visible={snap.confirmationDialog?.type === "row"}
        title={
          <p className="break-words">
            <span>Confirm to delete the selected row</span>
            <span>{numRows > 1 && "s"}</span>
          </p>
        }
        confirmLabel="Delete"
        confirmLabelLoading="Deleting"
        onCancel={() => snap.closeConfirmationDialog()}
        onConfirm={() => onConfirmDeleteRow()}
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground-light">
            <span>Are you sure you want to delete </span>
            <span>{isAllRowsSelected ? "all" : "the selected"} </span>
            <span>{numRows > 1 && `${numRows} `}</span>
            <span>row</span>
            <span>{numRows > 1 && "s"}</span>
            <span>? This action cannot be undone.</span>
          </p>
        </div>
      </ConfirmationModal>
    </>
  );
};

export default DeleteConfirmationDialogs;
