import { Maximize } from "lucide-react";
import { useCallback, useState } from "react";
import type { RenderEditCellProps } from "react-data-grid";
import { toast } from "sonner";

import { MAX_CHARACTERS } from "@nuvix/pg-meta/src/query/table-row-query";

import { useTableEditorQuery } from "@/data/table-editor/table-editor-query";
import { isTableLike } from "@/data/table-editor/table-editor-types";
import { useGetCellValueMutation } from "@/data/table-rows/get-cell-value-mutation";
import { useTableEditorTableStateSnapshot } from "@/lib/store/table";
import { Button, IconButton, useToast } from "@nuvix/ui/components";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { cn } from "@nuvix/sui/lib/utils";
import { BlockKeys, Key } from "../common/BlockKeys";
import { EmptyValue } from "../common/EmptyValue";
import { MonacoEditor } from "../common/MonacoEditor";
import { NullValue } from "../common/NullValue";
import { TruncatedWarningOverlay } from "./TruncatedWarningOverlay";
import { useParams } from "next/navigation";
import { useProjectStore } from "@/lib/store";
import { useTableEditorStore } from "@/lib/store/table-editor";
import Popover from "@/components/editor/components/_popover";
import ConfirmationModal from "@/components/editor/components/_confim_dialog";
import { TableParam } from "@/types";

export const TextEditor = <TRow, TSummaryRow = unknown>({
  row,
  column,
  isNullable,
  isEditable,
  onRowChange,
  onExpandEditor,
}: RenderEditCellProps<TRow, TSummaryRow> & {
  isNullable?: boolean;
  isEditable?: boolean;
  onExpandEditor: (column: string, row: TRow) => void;
}) => {
  const snap = useTableEditorTableStateSnapshot();
  const { addToast } = useToast();
  const { project, sdk } = useProjectStore();
  const { tableId } = useParams<TableParam>();

  const { data: selectedTable } = useTableEditorQuery({
    projectRef: project.$id,
    sdk,
    id: Number(tableId),
  });

  const gridColumn = snap.gridColumns.find((x) => x.name == column.key);
  const rawValue = row[column.key as keyof TRow] as unknown;
  const initialValue = rawValue || rawValue === "" ? String(rawValue) : null;
  const [isPopoverOpen, setIsPopoverOpen] = useState(true);
  const [value, setValue] = useState<string | null>(initialValue);
  const [isConfirmNextModalOpen, setIsConfirmNextModalOpen] = useState(false);

  const { mutate: getCellValue, isPending: isLoading, isSuccess } = useGetCellValueMutation();

  const isTruncated =
    typeof initialValue === "string" &&
    initialValue.endsWith("...") &&
    initialValue.length > MAX_CHARACTERS;

  const loadFullValue = () => {
    if (!isTableLike(selectedTable)) return;

    if (selectedTable.primary_keys.length === 0) {
      return addToast("Unable to load value as table has no primary keys");
    }

    const pkMatch = selectedTable.primary_keys.reduce((a, b) => {
      return { ...a, [b.name]: (row as any)[b.name] };
    }, {});

    getCellValue(
      {
        table: { schema: selectedTable.schema, name: selectedTable.name },
        column: column.name as string,
        pkMatch,
        projectRef: project?.$id,
        sdk,
      },
      { onSuccess: (data) => setValue(data) },
    );
  };

  const cancelChanges = useCallback(() => {
    if (isEditable) onRowChange(row, true);
    setIsPopoverOpen(false);
  }, []);

  const saveChanges = useCallback(
    (newValue: string | null) => {
      if (isEditable && newValue !== value) {
        onRowChange({ ...row, [column.key]: newValue }, true);
      }
      setIsPopoverOpen(false);
    },
    [isSuccess],
  );

  const onSelectExpand = () => {
    cancelChanges();
    onExpandEditor(column.key, {
      ...row,
      [column.key]: value || (row as any)[column.key],
    });
  };

  const onChange = (_value: string | undefined) => {
    if (!isEditable) return;
    if (!_value) setValue("");
    else setValue(_value);
  };

  return (
    <>
      <Popover
        open={isPopoverOpen}
        side="bottom"
        align="start"
        sideOffset={-35}
        className="rounded-none"
        overlay={
          isTruncated && !isSuccess ? (
            <div
              style={{ width: `${gridColumn?.width || column.width}px` }}
              className="flex items-center justify-center flex-col relative"
            >
              <MonacoEditor
                readOnly
                onChange={() => {}}
                width={`${gridColumn?.width || column.width}px`}
                value={value ?? ""}
                language="markdown"
              />
              <TruncatedWarningOverlay isLoading={isLoading} loadFullValue={loadFullValue} />
            </div>
          ) : (
            <BlockKeys
              value={value}
              onEscape={cancelChanges}
              onEnter={saveChanges}
              ignoreOutsideClicks={isConfirmNextModalOpen}
            >
              <MonacoEditor
                width={`${gridColumn?.width || column.width}px`}
                value={value ?? ""}
                readOnly={!isEditable}
                onChange={onChange}
              />
              {isEditable && (
                <div className="flex items-start justify-between p-2 space-x-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Key>⏎</Key>
                      <p className="text-xs text-muted-foreground">Save changes</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Key>Esc</Key>
                      <p className="text-xs text-muted-foreground">Cancel changes</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-y-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconButton
                          type="button"
                          variant="secondary"
                          size="s"
                          onClick={() => onSelectExpand()}
                          icon={<Maximize size={12} strokeWidth={2} />}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Expand editor</TooltipContent>
                    </Tooltip>
                    {isNullable && (
                      <Button
                        size="s"
                        type="button"
                        variant="secondary"
                        onClick={() => setIsConfirmNextModalOpen(true)}
                      >
                        Set to NULL
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </BlockKeys>
          )
        }
      >
        <div
          className={cn(
            !!value && value.toString().trim().length === 0 && "nx-grid-fill-container",
            "nx-grid-text-editor__trigger",
          )}
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        >
          {value === null ? <NullValue /> : value === "" ? <EmptyValue /> : value}
        </div>
      </Popover>
      <ConfirmationModal
        visible={isConfirmNextModalOpen}
        title="Confirm setting value to NULL"
        confirmLabel="Confirm"
        onCancel={() => setIsConfirmNextModalOpen(false)}
        onConfirm={() => {
          saveChanges(null);
        }}
      >
        <p className="text-sm text-muted-foreground">
          Are you sure you wish to set this value to NULL? This action cannot be undone.
        </p>
      </ConfirmationModal>
    </>
  );
};
