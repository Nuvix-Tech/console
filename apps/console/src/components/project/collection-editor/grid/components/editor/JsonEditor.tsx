import { Edit3, Maximize } from "lucide-react";
import { useCallback, useState } from "react";
import type { RenderEditCellProps } from "react-data-grid";

import { prettifyJSON, removeJSONTrailingComma, tryParseJson } from "@/lib/helpers";
import { BlockKeys, Key } from "@/components/grid/components/common/BlockKeys";
import { Column, useToast } from "@nuvix/ui/components";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import Popover from "@/components/editor/components/_popover";
import { MonacoEditor } from "@/components/grid/components/common/MonacoEditor";
import { NullValue } from "@/components/grid/components/common/NullValue";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
import type { Models } from "@nuvix/console";

const verifyJSON = (value: string) => {
  try {
    JSON.parse(value);
    return true;
  } catch (err) {
    return false;
  }
};

interface JsonEditorProps<TRow, TSummaryRow = unknown>
  extends RenderEditCellProps<TRow, TSummaryRow> {
  isEditable: boolean;
  isArray?: boolean;
  onExpandEditor: (column: string, row: TRow) => void;
}

const tryFormatInitialValue = (value: string) => {
  try {
    const jsonValue = JSON.parse(value);
    return JSON.stringify(jsonValue);
  } catch (err) {
    if (typeof value === "string") {
      return value.replaceAll(`\"`, `"`);
    } else {
      return JSON.stringify(value);
    }
  }
};

export const JsonEditor = <TRow, TSummaryRow = unknown>({
  row,
  column,
  isEditable = true,
  isArray,
  onRowChange,
  onExpandEditor,
}: JsonEditorProps<TRow, TSummaryRow>) => {
  // const collectionEditor = useCollectionEditorStore();
  const snap = useCollectionEditorCollectionStateSnapshot();
  const { addToast } = useToast();
  const gridColumn = snap.gridColumns.find((x) => x.name == column.key);

  const rawInitialValue = row[column.key as keyof TRow] as unknown;
  const initialValue =
    rawInitialValue === null || rawInitialValue === undefined || typeof rawInitialValue === "string"
      ? rawInitialValue
      : JSON.stringify(rawInitialValue);

  const jsonString = prettifyJSON(initialValue ? tryFormatInitialValue(initialValue) : "");

  const [isPopoverOpen, setIsPopoverOpen] = useState(true);
  const [value, setValue] = useState<string | null>(jsonString);

  const cancelChanges = useCallback(() => {
    if (isEditable) onRowChange(row, true);
    setIsPopoverOpen(false);
  }, []);

  const saveChanges = useCallback(
    (newValue: string | null) => {
      const updatedValue = newValue !== null ? removeJSONTrailingComma(newValue) : newValue;
      if (updatedValue !== value) {
        commitChange(newValue);
      } else {
        setIsPopoverOpen(false);
      }
    },
    [initialValue],
  );

  const onChange = (_value: string | undefined) => {
    if (!isEditable) return;
    if (!_value || _value == "") setValue(null);
    else setValue(_value);
  };

  const onSelectExpand = () => {
    cancelChanges();
    onExpandEditor(column.key, {
      ...row,
      [column.key]: tryParseJson(value) || (row as any)[column.key],
    });
  };

  // const onSelectAdvanceEditor = () => {
  //   cancelChanges();
  //   collectionEditor.onEditRow(
  //     {
  //       ...row,
  //       [column.key]: tryParseJson(value) || (row as any)[column.key],
  //     } as unknown as Models.Document,
  //   );
  // };

  const commitChange = (newValue: string | null) => {
    if (!isEditable) return;

    if (!newValue) {
      onRowChange({ ...row, [column.key]: null }, true);
      setIsPopoverOpen(false);
    } else if (verifyJSON(newValue)) {
      const jsonValue = JSON.parse(newValue);
      onRowChange({ ...row, [column.key]: jsonValue }, true);
      setIsPopoverOpen(false);
    } else {
      addToast({
        variant: "danger",
        message: "Please enter a valid JSON",
      });
    }
  };

  return (
    <Popover
      open={isPopoverOpen}
      side="bottom"
      align="start"
      sideOffset={-35}
      className="rounded-none"
      overlay={
        <BlockKeys value={value} onEscape={cancelChanges} onEnter={saveChanges}>
          <MonacoEditor
            width={`${gridColumn?.width || column.width}px`}
            value={value ?? ""}
            language="json"
            readOnly={!isEditable}
            onChange={onChange}
          />
          <div className="flex items-start justify-between p-2 gap-x-2">
            {isEditable && (
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
            )}
            <Column gap="2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={[
                      "border border-strong rounded p-1 flex items-center justify-center",
                      "transition cursor-pointer bg-selection hover:bg-border-strong",
                    ].join(" ")}
                    onClick={() => onSelectExpand()}
                  >
                    <Maximize size={12} strokeWidth={2} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center">
                  <span>Expand editor</span>
                </TooltipContent>
              </Tooltip>
              {/* {isArray && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={[
                        "border border-strong rounded p-1 flex items-center justify-center",
                        "transition cursor-pointer bg-selection hover:bg-border-strong",
                      ].join(" ")}
                      onClick={() => onSelectAdvanceEditor()}
                    >
                      <Edit3 size={12} strokeWidth={2} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    <span>Advance editor</span>
                  </TooltipContent>
                </Tooltip>
              )} */}
            </Column>
          </div>
        </BlockKeys>
      }
    >
      <div
        className={`${
          !!value && jsonString.trim().length == 0 ? "nx-grid-fill-container" : ""
        } nx-grid-json-editor__trigger`}
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
      >
        {value === null || value === "" ? <NullValue /> : jsonString}
      </div>
    </Popover>
  );
};
