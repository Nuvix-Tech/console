import { Key } from "lucide-react";
import { DataGrid, Column } from "react-data-grid";

import { NullValue } from "@/components/grid/components/common/NullValue";
import { COLUMN_MIN_WIDTH } from "@/components/grid/constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { gridStyles2 } from "@/components/grid/components/grid/Grid";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import type { Models } from "@nuvix/console";
import { getColumnDefaultWidth, internalAttributes } from "../../../grid/utils/gridColumns";
import { Attributes } from "../../ColumnEditor/utils";

export interface SelectorGridProps {
  rows: Models.Document[];
  onRowSelect: (row: Models.Document) => void;
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

const SelectorGrid = ({ rows, onRowSelect }: SelectorGridProps) => {
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
