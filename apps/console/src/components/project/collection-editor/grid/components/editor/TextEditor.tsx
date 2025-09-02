import { Maximize } from "lucide-react";
import { useCallback, useState } from "react";
import type { RenderEditCellProps } from "react-data-grid";
import { Button, IconButton, useToast } from "@nuvix/ui/components";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { cn } from "@nuvix/sui/lib/utils";
import Popover from "@/components/editor/components/_popover";
import ConfirmationModal from "@/components/editor/components/_confim_dialog";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { BlockKeys, Key } from "@/components/grid/components/common/BlockKeys";
import { MonacoEditor } from "@/components/grid/components/common/MonacoEditor";
import { NullValue } from "@/components/grid/components/common/NullValue";
import { EmptyValue } from "@/components/grid/components/common/EmptyValue";

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
  // TODO: add support for text formats
  const snap = useCollectionEditorCollectionStateSnapshot();

  const gridColumn = snap.gridColumns.find((x) => x.name == column.key);
  const rawValue = row[column.key as keyof TRow] as unknown;
  const initialValue = rawValue || rawValue === "" ? String(rawValue) : null;
  const [isPopoverOpen, setIsPopoverOpen] = useState(true);
  const [value, setValue] = useState<string | null>(initialValue);
  const [isConfirmNextModalOpen, setIsConfirmNextModalOpen] = useState(false);

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
    [initialValue],
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
        sideOffset={-28}
        className="!rounded-t-none !rounded-b-xs"
        overlay={
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
                        icon={Maximize}
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
                      className="!text-xs"
                      weight="default"
                    >
                      Set to NULL
                    </Button>
                  )}
                </div>
              </div>
            )}
          </BlockKeys>
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
