import { Edit3, MoreHorizontal, Trash2 } from "lucide-react";
import { ChangeEvent, InputHTMLAttributes, SyntheticEvent, useRef } from "react";
import {
  CalculatedColumn,
  RenderCellProps,
  RenderGroupCellProps,
  RenderHeaderCellProps,
  useHeaderRowSelection,
  useRowSelection,
} from "react-data-grid";

import { SELECT_COLUMN_KEY } from "../../constants";
import { Icon, IconButton, Text } from "@nuvix/ui/components";
import { Checkbox } from "@nuvix/cui/checkbox";
import type { Models } from "@nuvix/console";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { cn } from "@nuvix/sui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@nuvix/sui/components/dropdown-menu";
import { copyToClipboard } from "@/lib/helpers";

export const SelectColumn: CalculatedColumn<any, any> = {
  key: SELECT_COLUMN_KEY,
  name: "",
  idx: 0,
  width: 60,
  maxWidth: 60,
  resizable: false,
  sortable: false,
  frozen: true,
  // isLastFrozenColumn: false,
  renderHeaderCell: (props: RenderHeaderCellProps<unknown>) => {
    // [Unkown] formatter is actually a valid React component, so we can use hooks here
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isIndeterminate, isRowSelected, onRowSelectionChange } = useHeaderRowSelection();

    return (
      <SelectCellHeader
        aria-label="Select All"
        tabIndex={props.tabIndex}
        isIndeterminate={isIndeterminate}
        value={isRowSelected}
        onChange={(checked) => onRowSelectionChange({ checked })}
      />
    );
  },
  renderCell: (props: RenderCellProps<Models.Document>) => {
    // [Alaister] formatter is actually a valid React component, so we can use hooks here
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isRowSelected, onRowSelectionChange } = useRowSelection();
    return (
      <SelectCellFormatter
        aria-label="Select"
        tabIndex={props.tabIndex}
        value={isRowSelected}
        row={props.row}
        onChange={(checked, isShiftClick) => {
          onRowSelectionChange({ row: props.row, checked, isShiftClick });
        }}
        // Stop propagation to prevent row selection
        onClick={stopPropagation}
      />
    );
  },
  renderGroupCell: (props: RenderGroupCellProps<Models.Document>) => {
    // [Alaister] groupFormatter is actually a valid React component, so we can use hooks here
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isRowSelected, onRowSelectionChange } = useRowSelection();
    return (
      <SelectCellFormatter
        aria-label="Select Group"
        tabIndex={props.tabIndex}
        value={isRowSelected}
        onChange={(checked) => {
          onRowSelectionChange({
            row: props.row,
            checked,
            isShiftClick: false,
          });
        }}
        // Stop propagation to prevent row selection
        onClick={stopPropagation}
      />
    );
  },

  // [Next 18 Refactor] Double check if this is correct
  parent: undefined,
  level: 0,
  minWidth: 0,
  draggable: false,
};

function stopPropagation(event: SyntheticEvent) {
  event.stopPropagation();
}

type SharedInputProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "disabled" | "tabIndex" | "onClick" | "aria-label" | "aria-labelledby"
>;

interface SelectCellFormatterProps extends SharedInputProps {
  value: boolean;
  row?: Models.Document;
  onChange: (value: boolean, isShiftClick: boolean) => void;
}

function SelectCellFormatter({
  row,
  value,
  tabIndex,
  disabled,
  onClick,
  onChange,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SelectCellFormatterProps) {
  const snap = useCollectionEditorStore();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey);
  }

  const collValue = row?.$sequence;

  return (
    <div className="nx-grid-select-cell__formatter flex justify-between items-center w-full">
      <Checkbox
        size={"sm"}
        checked={value}
        disabled={disabled}
        onClick={onClick as any}
        onCheckedChange={(e) => onChange(!!e.checked, false)}
        onChange={handleChange as any}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={tabIndex}
        className={cn(
          "rdg-row__select-column__select-action rdg-row__select-column__checkbox-action",
          "transition-all duration-200",
          {
            "flex! opacity-100!": value,
          },
        )}
      />
      <p
        className={cn("rdg-row__select-column__seq", {
          hidden: value,
        })}
      >
        {collValue}
      </p>
      {row && (
        <DropdownMenu>
          <DropdownMenuTrigger className="neutral-on-backround-weak transition-all text-transparent group-hover:text-foreground data-[state=open]:text-foreground">
            <IconButton
              type="text"
              size="s"
              variant="tertiary"
              icon={MoreHorizontal}
              tooltip={"More Actions"}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-48">
            <DropdownMenuItem
              key="edit-row"
              className="space-x-2"
              onClick={(e) => {
                e.stopPropagation();
                snap.onEditRow(row);
              }}
            >
              <Icon name={Edit3} size="s" />
              <span>Update</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              key="managed-permissions"
              className="space-x-2"
              onClick={(e) => {
                e.stopPropagation();
                snap.onEditRow(row); // TODO: Implement edit permissions functionality
              }}
            >
              <Icon name={"key"} size="s" />
              <span>Manage permissions</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              key="view-activity"
              className="space-x-2"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Icon name={"logs"} size="s" />
              <span>View activity</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-x-2 space-x-2">
                <Icon name="clipboard" size="s" />
                Copy
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  key="copy-table-json"
                  className="space-x-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(JSON.stringify(row));
                  }}
                >
                  <span>Copy as JSON</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              key="delete-row"
              className="space-x-2"
              onClick={(e) => {
                e.stopPropagation();
                snap.onDeleteRows([row.$id]);
              }}
            >
              <Icon name="trash" size="s" onBackground="danger-weak" />
              <Text onBackground="danger-weak">Delete document</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

interface SelectCellHeaderProps extends SharedInputProps {
  value: boolean;
  onChange: (value: boolean, isShiftClick: boolean) => void;
  isIndeterminate: boolean;
}

export function SelectCellHeader({
  disabled,
  tabIndex,
  value,
  onChange,
  isIndeterminate,
  onClick,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SelectCellHeaderProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey);
  }

  return (
    <div className="nx-grid-select-cell__header flex items-center justify-between w-full">
      <Checkbox
        size={"sm"}
        borderColor={"fg.success"}
        checked={isIndeterminate ? "indeterminate" : value}
        disabled={disabled}
        onClick={onClick as any}
        onCheckedChange={({ checked }) =>
          onChange(checked === "indeterminate" ? false : checked, false)
        }
        onChange={handleChange as any}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={tabIndex}
        className="nx-grid-select-cell__header__input"
      />
      <AddColumnHeader />
    </div>
  );
}

const AddColumnHeader = () => {
  const tableEditorSnap = useCollectionEditorStore();

  return (
    <IconButton icon="plus" variant="tertiary" size="s" onClick={tableEditorSnap.onAddColumn} />
  );
};
