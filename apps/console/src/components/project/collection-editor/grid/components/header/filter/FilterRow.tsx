import { ChevronDown, X } from "lucide-react";
import { KeyboardEvent, memo } from "react";

import { DropdownControl } from "@/components/grid/components/common/DropdownControl";
import type { Filter, FilterOperator } from "@/components/grid/types";
import { FilterOperatorOptions } from "./Filter.constants";
import { Button, IconButton } from "@nuvix/ui/components";
import { Input } from "@/components/others/ui";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { Attributes } from "@/components/project/collection-editor/SidePanelEditor/ColumnEditor/utils";

export interface FilterRowProps {
  filterIdx: number;
  filter: Filter;
  onChange: (index: number, filter: Filter) => void;
  onDelete: (index: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

const FilterRow = ({ filter, filterIdx, onChange, onDelete, onKeyDown }: FilterRowProps) => {
  const snap = useCollectionEditorCollectionStateSnapshot();
  const column = snap.collection.attributes.find((x) => x.key === filter.column);
  const columnOptions =
    snap.collection.attributes?.map((x) => {
      return { value: x.key, label: x.key, postLabel: x.type };
    }) || [];

  const placeholder =
    column?.type === Attributes.Timestamptz ? "yyyy-mm-dd hh:mm:ss+zz" : "Enter a value";

  return (
    <div className="flex w-full items-center justify-between gap-x-1 px-3">
      <DropdownControl
        align="start"
        options={columnOptions}
        onSelect={(nextColumn) => onChange(filterIdx, { ...filter, column: nextColumn as string })}
      >
        <Button
          asChild
          size="s"
          variant="secondary"
          prefixIcon={
            <div className="text-muted-foreground">
              <ChevronDown strokeWidth={1.5} size={18} />
            </div>
          }
          className="!w-32 justify-start"
        >
          <span>{column?.key ?? ""}</span>
        </Button>
      </DropdownControl>
      <DropdownControl
        align="start"
        options={FilterOperatorOptions}
        onSelect={(nextOperator) =>
          onChange(filterIdx, {
            ...filter,
            operator: nextOperator as FilterOperator,
          })
        }
      >
        <Button
          // asChild
          size="s"
          variant="secondary"
          prefixIcon={
            <div className="text-muted-foreground">
              <ChevronDown strokeWidth={1.5} size={18} />
            </div>
          }
        >
          <span>{filter.operator}</span>
        </Button>
      </DropdownControl>
      <Input
        placeholder={placeholder}
        size={"xs"}
        value={filter.value}
        onChange={(event) =>
          onChange(filterIdx, {
            ...filter,
            value: event.target.value,
          })
        }
        onKeyDown={onKeyDown}
      />
      <IconButton
        type="text"
        size="s"
        variant="tertiary"
        icon={<X strokeWidth={1.5} size={18} />}
        onClick={() => onDelete(filterIdx)}
      />
    </div>
  );
};
export default memo(FilterRow);
