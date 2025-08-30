import { Key } from "lucide-react";
import {
  DataGrid,
  Column,
  type CalculatedColumn,
  type RenderHeaderCellProps,
  useHeaderRowSelection,
  type RenderCellProps,
  useRowSelection,
} from "react-data-grid";

import { NullValue } from "@/components/grid/components/common/NullValue";
import { COLUMN_MIN_WIDTH } from "@/components/grid/constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { gridStyles2 } from "@/components/grid/components/grid/Grid";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import type { Models } from "@nuvix/console";
import { getColumnDefaultWidth, internalAttributes } from "../../../grid/utils/gridColumns";
import { Attributes } from "../../ColumnEditor/utils";
import { SELECT_COLUMN_KEY } from "../../../grid/constants";
import type { ChangeEvent } from "react";
import { Checkbox } from "@nuvix/cui/checkbox";
import { cn } from "@nuvix/sui/lib/utils";

export interface SelectorGridProps {
  rows: Models.Document[];
  onRowSelect: (row: Models.Document) => void;
  multiSelect: boolean;
}

const columnRender = (name: string, isPrimaryKey = false) => {
  return (
    <div className="flex h-full items-center gap-2">
      {isPrimaryKey && (
        <Tooltip>
          <TooltipTrigger>
            <div className="brand-on-background-weak rotate-45">
              <Key size={14} strokeWidth={2} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">Primary key</TooltipContent>
        </Tooltip>
      )}

      <span className="nx-grid-column-header__inner__name">{name}</span>
    </div>
  );
};

// TODO: move this formatter out to a common component
const formatter = ({
  column,
  format,
  row,
}: {
  column: string;
  format: string;
  row: Models.Document;
}) => {
  const formattedValue =
    row[column] === null
      ? null
      : typeof row[column] === "object"
        ? JSON.stringify(row[column])
        : row[column];

  return (
    <div className="group nx-grid-select-cell__formatter overflow-hidden">
      {formattedValue === null ? (
        <NullValue />
      ) : (
        <span className="text-sm truncate">{formattedValue}</span>
      )}
    </div>
  );
};

const SelectorGrid = ({ rows, onRowSelect, multiSelect }: SelectorGridProps) => {
  const snap = useCollectionEditorCollectionStateSnapshot();

  const columns: Column<Models.Document>[] = [
    internalAttributes[0],
    ...snap.collection.attributes.filter((a) => a.type !== Attributes.Relationship),
    ...internalAttributes.slice(1),
  ].map((column) => {
    const columnDefaultWidth = getColumnDefaultWidth(column as any);
    const rawSize = typeof column.size === "number" ? column.size : columnDefaultWidth;
    // clamp size to be strictly below 500
    const columnSize = Math.min(rawSize, columnDefaultWidth);
    const columnWidth = Math.max(columnDefaultWidth, columnSize);

    const result: Column<Models.Document> = {
      key: column.key,
      name: column.key,
      renderCell: (props) => formatter({ column: column.key, format: column.type, row: props.row }),
      renderHeaderCell: () => columnRender(column.key, (column as any).isPrimaryKey),
      resizable: true,
      width: columnWidth,
      minWidth: COLUMN_MIN_WIDTH,
    };
    return result;
  });

  if (multiSelect) columns.unshift(SelectColumn);

  function onSelectedRowsChange(selectedRows: Set<string>) {
    snap.setSelectedRows(selectedRows);
  }

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      style={{ ...gridStyles2, height: "100%" }}
      onCellClick={multiSelect ? undefined : (props) => onRowSelect(props.row)}
      rowClass={() => (multiSelect ? "cursor-pointer" : "")}
      selectedRows={snap.selectedRows}
      rowKeyGetter={(row) => row.$id}
      onSelectedRowsChange={onSelectedRowsChange}
    />
  );
};

export const SelectColumn: CalculatedColumn<any, any> = {
  key: SELECT_COLUMN_KEY,
  name: "",
  idx: 0,
  width: 32,
  maxWidth: 32,
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
        value={isRowSelected}
        isIndeterminate={isIndeterminate}
        onChange={(checked: any) => onRowSelectionChange({ checked })}
      />
    );
  },
  renderCell: (props: RenderCellProps<Models.Document>) => {
    // [Unknwon] formatter is actually a valid React component, so we can use hooks here
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isRowSelected, onRowSelectionChange } = useRowSelection();
    return (
      <SelectCellFormatter
        aria-label="Select"
        tabIndex={props.tabIndex}
        value={isRowSelected}
        row={props.row}
        onChange={(checked: any, isShiftClick: any) => {
          onRowSelectionChange({ row: props.row, checked, isShiftClick });
        }}
        // Stop propagation to prevent row selection
        onClick={(e: any) => e.stopPropagation()}
      />
    );
  },
  parent: undefined,
  level: 0,
  minWidth: 0,
  draggable: false,
};

function SelectCellFormatter({
  row,
  value,
  tabIndex,
  disabled,
  onClick,
  onChange,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: any) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey);
  }

  return (
    <div className="nx-grid-select-cell__formatter flex justify-between items-center w-full backdrop-blur-md">
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
        className={cn("rdg-row__select-column__select-action", "transition-all duration-200")}
      />
    </div>
  );
}

export function SelectCellHeader({
  disabled,
  tabIndex,
  value,
  onChange,
  onClick,
  isIndeterminate,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: any) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey);
  }

  return (
    <div className="nx-grid-select-cell__header flex items-center justify-between w-full backdrop-blur-md">
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
    </div>
  );
}

export default SelectorGrid;
