import update from "immutability-helper";
import { isEqual } from "lodash";
import { FilterIcon, Plus } from "lucide-react";
import { KeyboardEvent, useCallback, useMemo, useState } from "react";

import { formatFilterURLParams } from "../../../NuvixGrid.utils";
import type { Filter } from "../../../types";

import FilterRow from "./FilterRow";
import { Popover, PopoverContent, PopoverTrigger } from "@nuvix/sui/components/popover";
import { Button } from "@nuvix/ui/components";
import { useTableEditorTableStateSnapshot } from "@/lib/store/table";
import { Separator } from "@nuvix/sui/components/separator";
import { cn } from "@nuvix/sui/lib/utils";

export interface FilterPopoverProps {
  filters: string[];
  portal?: boolean;
  onApplyFilters: (filters: Filter[]) => void;
}

const FilterPopover = ({ filters, portal = true, onApplyFilters }: FilterPopoverProps) => {
  const [open, setOpen] = useState(false);

  const btnText =
    (filters || []).length > 0
      ? `Filtered by ${filters.length} rule${filters.length > 1 ? "s" : ""}`
      : "Filter";

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          size="s"
          variant="tertiary"
          className={cn({
            "!text-[var(--brand-on-background-medium)]": (filters || []).length > 0,
          })}
          prefixIcon={<FilterIcon size={16} />}
        >
          {btnText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-96" side="bottom" align="start">
        {/* portal={portal} */}
        <FilterOverlay filters={filters} onApplyFilters={onApplyFilters} />
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;

interface FilterOverlayProps {
  filters: string[];
  onApplyFilters: (filter: Filter[]) => void;
}

const FilterOverlay = ({ filters: filtersFromUrl, onApplyFilters }: FilterOverlayProps) => {
  const snap = useTableEditorTableStateSnapshot();

  const initialFilters = useMemo(
    () => formatFilterURLParams((filtersFromUrl as string[]) ?? []),
    [filtersFromUrl],
  );
  const [filters, setFilters] = useState<Filter[]>(initialFilters);

  function onAddFilter() {
    const column = snap.table.columns[0]?.name;

    if (column) {
      setFilters([
        ...filters,
        {
          column,
          operator: "=",
          value: "",
        },
      ]);
    }
  }

  const onChangeFilter = useCallback((index: number, filter: Filter) => {
    setFilters((currentFilters) =>
      update(currentFilters, {
        [index]: {
          $set: filter,
        },
      }),
    );
  }, []);

  const onDeleteFilter = useCallback((index: number) => {
    setFilters((currentFilters) =>
      update(currentFilters, {
        $splice: [[index, 1]],
      }),
    );
  }, []);

  const onSelectApplyFilters = () => {
    // [Joshen] Trim empty spaces in input for only UUID type columns
    const formattedFilters = filters.map((f) => {
      const column = snap.table.columns.find((c) => c.name === f.column);
      if (column?.format === "uuid") return { ...f, value: f.value.trim() };
      else return f;
    });
    setFilters(formattedFilters);
    onApplyFilters(formattedFilters);
  };

  function handleEnterKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") onSelectApplyFilters();
  }

  return (
    <div className="space-y-2 py-2">
      <div className="space-y-2">
        {filters.map((filter, index) => (
          <FilterRow
            key={`filter-${filter.column}-${[index]}`}
            filter={filter}
            filterIdx={index}
            onChange={onChangeFilter}
            onDelete={onDeleteFilter}
            onKeyDown={handleEnterKeyDown}
          />
        ))}
        {filters.length == 0 && (
          <div className="space-y-1 px-3">
            <h5 className="text-sm neutral-on-background-medium">
              No filters applied to this view
            </h5>
            <p className="text-xs neutral-on-background-weak">
              Add a column below to filter the view
            </p>
          </div>
        )}
      </div>
      <Separator />
      <div className="px-3 flex flex-row justify-between">
        <Button
          size="s"
          variant="tertiary"
          prefixIcon={<Plus size={18} />}
          type="text"
          onClick={onAddFilter}
        >
          Add filter
        </Button>
        <Button
          disabled={isEqual(filters, initialFilters)}
          type="default"
          size="s"
          onClick={() => onSelectApplyFilters()}
        >
          Apply filter
        </Button>
      </div>
    </div>
  );
};
