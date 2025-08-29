import { toast } from "sonner";
import { useProjectStore } from "@/lib/store";
import type { Models } from "@nuvix/console";
import {
  useAttributeDeleteMutation,
  useCollectionDeleteMutation,
  useIndexDeleteMutation,
} from "@/data/collections";
import { useDocumentDeleteMutation } from "@/data/collections/documents/document_delete_mutation";
import ConfirmationModal from "@/components/editor/components/_confim_dialog";
import { useCollectionEditorStateSnapshot } from "@/lib/store/collection-editor";
import { useCollectionFilter } from "../grid/hooks/useCollectionFilter";

export type DeleteConfirmationDialogsProps = {
  selectedCollection?: Models.Collection;
  onCollectionDeleted?: () => void;
};

const DeleteConfirmationDialogs = ({
  selectedCollection,
  onCollectionDeleted,
}: DeleteConfirmationDialogsProps) => {
  const { project, sdk } = useProjectStore((state) => state);
  const snap = useCollectionEditorStateSnapshot();
  const { filters, onApplyFilters } = useCollectionFilter();

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

  const { mutate: deleteColumn } = useAttributeDeleteMutation({
    onSuccess: () => {
      if (!(snap.confirmationDialog?.type === "column")) return;
      const selectedColumnToDelete = snap.confirmationDialog.column;
      removeDeletedColumnFromFiltersAndSorts({ columnName: selectedColumnToDelete.key });
      toast.success(`Successfully deleted attribute "${selectedColumnToDelete.key}"`);
    },
    onError: (error) => {
      if (!(snap.confirmationDialog?.type === "column")) return;
      const selectedColumnToDelete = snap.confirmationDialog.column;
      toast.error(`Failed to delete ${selectedColumnToDelete!.key}: ${error.message}`);
    },
    onSettled: () => {
      snap.closeConfirmationDialog();
    },
  });

  const { mutate: deleteIndex } = useIndexDeleteMutation({
    onSuccess: () => {
      if (!(snap.confirmationDialog?.type === "index")) return;
      const selectedIndexToDelete = snap.confirmationDialog.index;
      toast.success(`Successfully deleted index "${selectedIndexToDelete.key}"`);
    },
    onError: (error) => {
      if (!(snap.confirmationDialog?.type === "index")) return;
      const selectedIndexToDelete = snap.confirmationDialog.index;
      toast.error(`Failed to delete ${selectedIndexToDelete!.key}: ${error.message}`);
    },
    onSettled: () => {
      snap.closeConfirmationDialog();
    },
  });

  const { mutate: deleteTable } = useCollectionDeleteMutation({
    onSuccess: async () => {
      toast.success(`Successfully deleted collection "${selectedCollection?.name}"`);
      onCollectionDeleted?.();
    },
    onError: (error) => {
      toast.error(`Failed to delete ${selectedCollection?.name}: ${error.message}`);
    },
    onSettled: () => {
      snap.closeConfirmationDialog();
    },
  });

  const { mutate: deleteRows } = useDocumentDeleteMutation({
    onSuccess: () => {
      if (snap.confirmationDialog?.type === "row") {
        snap.confirmationDialog.callback?.();
      }
      toast.success(`Successfully deleted selected documents(s)`);
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

  const onConfirmDeleteColumn = async () => {
    if (!(snap.confirmationDialog?.type === "column")) return;
    if (project === undefined) return;

    const selectedColumnToDelete = snap.confirmationDialog.column;
    if (selectedColumnToDelete === undefined) return;

    deleteColumn({
      attributeKey: selectedColumnToDelete.key, // TODO ------------------------ key is not actual id
      projectRef: project.$id,
      sdk,
      collection: selectedCollection!,
    });
  };

  const onConfirmDeleteIndex = async () => {
    if (!(snap.confirmationDialog?.type === "index")) return;
    if (project === undefined) return;

    const selectedIndexToDelete = snap.confirmationDialog.index;
    if (selectedIndexToDelete === undefined) return;

    deleteIndex({
      indexKey: selectedIndexToDelete.key,
      projectRef: project.$id,
      sdk,
      collection: selectedCollection!,
    });
  };

  const onConfirmDeleteTable = async () => {
    if (!(snap.confirmationDialog?.type === "table")) return;
    const selectedTableToDelete = selectedCollection!;

    if (selectedTableToDelete === undefined) return;

    deleteTable({
      projectRef: project?.$id!,
      sdk,
      schema: selectedTableToDelete.$schema,
      collection: selectedTableToDelete,
    });
  };

  const onConfirmDeleteRow = async () => {
    if (!project) return console.error("Project ref is required");
    if (!selectedCollection!) return console.error("Selected collection required");
    if (snap.confirmationDialog?.type !== "row") return;
    const selectedRowsToDelete = snap.confirmationDialog.rows;

    if (selectedRowsToDelete.length === 0) {
      toast.error("No rows selected");
      snap.closeConfirmationDialog();
      return;
    }

    deleteRows({
      projectRef: project.$id,
      sdk,
      collection: selectedCollection!,
      documentIds: selectedRowsToDelete as string[],
    });
  };

  return (
    <>
      <ConfirmationModal
        variant="destructive"
        visible={snap.confirmationDialog?.type === "column"}
        title={`Confirm deletion of attribute "${
          snap.confirmationDialog?.type === "column" && snap.confirmationDialog.column.key
        }"`}
        confirmLabel="Delete"
        confirmLabelLoading="Deleting"
        onCancel={() => {
          snap.closeConfirmationDialog();
        }}
        onConfirm={onConfirmDeleteColumn}
        description="Are you sure you want to delete the selected column? This action cannot be undone."
      />

      <ConfirmationModal
        variant="destructive"
        visible={snap.confirmationDialog?.type === "index"}
        title={`Confirm deletion of index "${
          snap.confirmationDialog?.type === "index" && snap.confirmationDialog.index.key
        }"`}
        confirmLabel="Delete"
        confirmLabelLoading="Deleting"
        onCancel={() => {
          snap.closeConfirmationDialog();
        }}
        onConfirm={onConfirmDeleteIndex}
        description="Are you sure you want to delete the selected column? This action cannot be undone."
      />

      <ConfirmationModal
        variant={"destructive"}
        visible={snap.confirmationDialog?.type === "table"}
        title={
          <span className="break-words">{`Confirm deletion of collection "${selectedCollection!?.name}"`}</span>
        }
        confirmLabel="Delete"
        confirmLabelLoading="Deleting"
        onCancel={() => {
          snap.closeConfirmationDialog();
        }}
        onConfirm={onConfirmDeleteTable}
        description="Are you sure you want to delete the selected collection? This action cannot be undone."
      />

      <ConfirmationModal
        variant={"destructive"}
        visible={snap.confirmationDialog?.type === "row"}
        title={
          <p className="break-words">
            <span>Confirm to delete the selected document</span>
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
            <span>document</span>
            <span>{numRows > 1 && "s"}</span>
            <span>? This action cannot be undone.</span>
          </p>
        </div>
      </ConfirmationModal>
    </>
  );
};

export default DeleteConfirmationDialogs;
