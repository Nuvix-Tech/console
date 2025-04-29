import update from "immutability-helper";
import { isEqual } from "lodash";
import { ChevronDown, List } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { formatSortURLParams } from "@/components/grid/SupabaseGrid.utils";
import { DropdownControl } from "@/components/grid/components/common/DropdownControl";
import type { Sort } from "@/components/grid/types";
import { useTableEditorTableState } from "@/lib/store/table";
import SortRow from "./SortRow";
import { Popover, PopoverContent, PopoverTrigger } from "@nuvix/sui/components/popover";
import { Button } from "@/ui/components";
import { Separator } from "@nuvix/sui/components/separator";

export interface SortPopoverProps {
  sorts: string[];
  portal?: boolean;
  onApplySorts: (sorts: Sort[]) => void;
}

const SortPopover = ({ sorts, portal = true, onApplySorts }: SortPopoverProps) => {
  const [open, setOpen] = useState(false);

  const btnText =
    (sorts || []).length > 0
      ? `Sorted by ${sorts.length} rule${sorts.length > 1 ? "s" : ""}`
      : "Sort";

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="s"
          type={(sorts || []).length > 0 ? "link" : "text"}
          prefixIcon={<List size={18} />}
        >
          {btnText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-96" side="bottom" align="start">
        {/* portal={portal} */}
        <SortOverlay sorts={sorts} onApplySorts={onApplySorts} />
      </PopoverContent>
    </Popover>
  );
};

export default SortPopover;

export interface SortOverlayProps {
  sorts: string[];
  onApplySorts: (sorts: Sort[]) => void;
}

const SortOverlay = ({ sorts: sortsFromUrl, onApplySorts }: SortOverlayProps) => {
  const { getState } = useTableEditorTableState();
  const snap = getState();

  const initialSorts = useMemo(
    () => formatSortURLParams(snap.table.name, sortsFromUrl ?? []),
    [snap.table.name, sortsFromUrl],
  );
  const [sorts, setSorts] = useState<Sort[]>(initialSorts);

  const columns = snap.table.columns.filter((x) => {
    // exclude json/jsonb columns from sorting. Sorting by json fields in PG is only possible if you provide key from
    // the JSON object.
    if (x.type === "json" || x.type === "jsonb") {
      return false;
    }
    const found = sorts.find((y) => y.column == x.name);
    return !found;
  });

  const dropdownOptions =
    columns?.map((x) => {
      return { value: x.name, label: x.name };
    }) || [];

  function onAddSort(columnName: string | number) {
    setSorts([...sorts, { table: snap.table.name, column: columnName as string, ascending: true }]);
  }

  const onDeleteSort = useCallback((column: string) => {
    setSorts((currentSorts) => currentSorts.filter((sort) => sort.column !== column));
  }, []);

  const onToggleSort = useCallback((column: string, ascending: boolean) => {
    setSorts((currentSorts) => {
      const idx = currentSorts.findIndex((x) => x.column === column);

      return update(currentSorts, {
        [idx]: {
          $merge: { ascending },
        },
      });
    });
  }, []);

  const onDragSort = useCallback((dragIndex: number, hoverIndex: number) => {
    setSorts((currentSort) =>
      update(currentSort, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, currentSort[dragIndex]],
        ],
      }),
    );
  }, []);

  return (
    <div className="space-y-2 py-2">
      {sorts.map((sort, index) => (
        <SortRow
          key={sort.column}
          index={index}
          columnName={sort.column}
          sort={sort}
          onDelete={onDeleteSort}
          onToggle={onToggleSort}
          onDrag={onDragSort}
        />
      ))}
      {sorts.length === 0 && (
        <div className="space-y-1 px-3">
          <h5 className="text-sm neutral-on-background-medium">No sorts applied to this view</h5>
          <p className="text-xs neutral-on-background-weak">Add a column below to sort the view</p>
        </div>
      )}

      <Separator />
      <div className="px-3 flex flex-row justify-between">
        {columns && columns.length > 0 ? (
          <DropdownControl
            options={dropdownOptions}
            onSelect={onAddSort}
            side="bottom"
            align="start"
          >
            <Button
              // asChild
              size="s"
              variant="tertiary"
              type="text"
              suffixIcon={<ChevronDown size="14" className="neutral-on-background-medium" />}
              className="sb-grid-dropdown__item-trigger"
              data-testid="table-editor-pick-column-to-sort-button"
            >
              <span>Pick {sorts.length > 1 ? "another" : "a"} column to sort by</span>
            </Button>
          </DropdownControl>
        ) : (
          <p className="text-sm text-foreground-light">All columns have been added</p>
        )}
        <div className="flex items-center">
          <Button
            disabled={isEqual(sorts, initialSorts)}
            size="s"
            type="default"
            onClick={() => onApplySorts(sorts)}
          >
            Apply sorting
          </Button>
        </div>
      </div>
    </div>
  );
};
