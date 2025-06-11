import { Key } from "lucide-react";
import { DataGrid, Column } from "react-data-grid";

import { NullValue } from "@/components/grid/components/common/NullValue";
import { COLUMN_MIN_WIDTH } from "@/components/grid/constants";
import type { NuvixRow } from "@/components/grid/types";
import {
  ESTIMATED_CHARACTER_PIXEL_WIDTH,
  getColumnDefaultWidth,
} from "@/components/grid/utils/gridColumns";

import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { convertByteaToHex } from "../RowEditor.utils";
import { useTableEditorTableStateSnapshot } from "@/lib/store/table";
import { gridStyles2 } from "@/components/grid/components/grid/Grid";

export interface SelectorGridProps {
  rows: NuvixRow[];
  onRowSelect: (row: NuvixRow) => void;
}

const columnRender = (name: string, isPrimaryKey = false) => {
  return (
    <div className="flex h-full items-center justify-center gap-2">
      {isPrimaryKey && (
        <Tooltip>
          <TooltipTrigger>
            <div className="text-brand">
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
const formatter = ({ column, format, row }: { column: string; format: string; row: NuvixRow }) => {
  const formattedValue =
    format === "bytea"
      ? convertByteaToHex(row[column])
      : row[column] === null
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

const SelectorGrid = ({ rows, onRowSelect }: SelectorGridProps) => {
  const snap = useTableEditorTableStateSnapshot();

  const columns: Column<NuvixRow>[] = snap.table.columns.map((column) => {
    const columnDefaultWidth = getColumnDefaultWidth(column);
    const columnWidthBasedOnName =
      (column.name.length + column.format.length) * ESTIMATED_CHARACTER_PIXEL_WIDTH;
    const columnWidth =
      columnDefaultWidth < columnWidthBasedOnName ? columnWidthBasedOnName : columnDefaultWidth;

    const result: Column<NuvixRow> = {
      key: column.name,
      name: column.name,
      renderCell: (props) =>
        formatter({ column: column.name, format: column.format, row: props.row }),
      renderHeaderCell: () => columnRender(column.name, column.isPrimaryKey),
      resizable: true,
      width: columnWidth,
      minWidth: COLUMN_MIN_WIDTH,
    };
    return result;
  });

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      style={{ ...gridStyles2, height: "100%" }}
      onCellClick={(props) => onRowSelect(props.row)}
      rowClass={() => "cursor-pointer"}
    />
  );
};

export default SelectorGrid;
