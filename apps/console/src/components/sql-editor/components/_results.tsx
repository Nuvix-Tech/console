import { Clipboard, Expand } from "lucide-react";
import { useState } from "react";
import { DataGrid, CalculatedColumn } from "react-data-grid";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@nuvix/sui/components/context-menu";
import { cn } from "@nuvix/sui/lib/utils";
import { copyToClipboard } from "@/lib/helpers";
import { handleCopyCell } from "@/components/grid/NuvixGrid.utils";
import { CellDetailPanel, CellDetailBox } from "./_cell_detail_panel";
import { useProjectStore } from "@/lib/store";
import { gridStyles } from "@/components/grid/components/grid/Grid";

function formatClipboardValue(value: any) {
  if (value === null) return "";
  if (typeof value == "object" || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  return value;
}

const Results = ({ rows, panel = false }: { rows: readonly any[]; panel?: boolean }) => {
  const [expandCell, setExpandCell] = useState(false);
  const [cellPosition, setCellPosition] = useState<{ column: any; row: any; rowIdx: number }>();
  const { setPanel } = useProjectStore();

  const formatter = (column: any, row: any) => {
    const cellValue = row[column];

    return (
      <ContextMenu modal={false}>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              "flex items-center h-full font-mono text-xs w-full whitespace-pre",
              cellValue === null && "text-muted-foreground",
            )}
          >
            {cellValue === null
              ? "NULL"
              : typeof cellValue === "string"
                ? cellValue
                : JSON.stringify(cellValue)}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent onCloseAutoFocus={(e) => e.stopPropagation()}>
          <ContextMenuItem
            className="gap-x-2"
            onSelect={() => {
              const value = formatClipboardValue(cellValue ?? "");
              copyToClipboard(value);
            }}
            onFocusCapture={(e) => e.stopPropagation()}
          >
            <Clipboard size={14} />
            Copy cell content
          </ContextMenuItem>
          <ContextMenuItem
            className="gap-x-2"
            onSelect={() => onExpand()}
            onFocusCapture={(e) => e.stopPropagation()}
          >
            <Expand size={14} />
            View cell content
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  const onExpand = () => {
    if (panel) {
      const node = (
        <CellDetailBox
          column={cellPosition?.column.name ?? ""}
          value={cellPosition?.row?.[cellPosition.column.name]}
          visible={expandCell}
          onClose={() => setPanel(undefined)}
        />
      );
      setPanel({
        id: cellPosition?.column.name ?? "cell",
        node,
        open: true,
      });
    } else setExpandCell(true);
  };

  const columnRender = (name: string) => {
    return <div className="flex h-full items-center font-mono text-xs">{name}</div>;
  };

  const EST_CHAR_WIDTH = 8.25;
  const MIN_COLUMN_WIDTH = 100;
  const MAX_COLUMN_WIDTH = 500;

  const columns: CalculatedColumn<any>[] = Object.keys(rows?.[0] ?? []).map((key, idx) => {
    const maxColumnValueLength = rows
      .map((row) => String(row[key]).length)
      .reduce((a, b) => Math.max(a, b), 0);

    const columnWidth = Math.max(
      Math.min(maxColumnValueLength * EST_CHAR_WIDTH, MAX_COLUMN_WIDTH),
      MIN_COLUMN_WIDTH,
    );

    return {
      idx,
      key,
      name: key,
      resizable: true,
      parent: undefined,
      level: 0,
      width: columnWidth,
      minWidth: MIN_COLUMN_WIDTH,
      maxWidth: undefined,
      draggable: false,
      frozen: false,
      sortable: false,
      isLastFrozenColumn: false,
      renderCell: ({ row }) => formatter(key, row),
      renderHeaderCell: () => columnRender(key),
    };
  });

  return (
    <>
      {rows.length === 0 ? (
        <div className="bg-table-header-light [[data-theme*=dark]_&]:bg-table-header-dark">
          <p className="m-0 border-0 px-4 py-3 font-mono text-sm neutral-on-background-medium">
            Success. No rows returned
          </p>
        </div>
      ) : (
        <>
          <DataGrid
            columns={columns}
            rows={rows}
            className="flex-grow !h-full !border-0"
            rowClass={() => "[&>.rdg-cell]:items-center"}
            onSelectedCellChange={setCellPosition}
            onCellKeyDown={handleCopyCell}
            style={gridStyles}
          />
          {!panel && (
            <CellDetailPanel
              column={cellPosition?.column.name ?? ""}
              value={cellPosition?.row?.[cellPosition.column.name]}
              visible={expandCell}
              onClose={() => setExpandCell(false)}
            />
          )}
        </>
      )}
    </>
  );
};

export default Results;
