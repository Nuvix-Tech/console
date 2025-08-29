import type { RenderEditCellProps } from "react-data-grid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@nuvix/sui/components/select";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";

interface Props<TRow, TSummaryRow = unknown> extends RenderEditCellProps<TRow, TSummaryRow> {
  isNullable?: boolean;
}

export const BooleanEditor = <TRow, TSummaryRow = unknown>({
  row,
  column,
  isNullable,
  onRowChange,
  onClose,
}: Props<TRow, TSummaryRow>) => {
  const snap = useCollectionEditorCollectionStateSnapshot();
  const gridColumn = snap.gridColumns.find((x) => x.name == column.key);
  const value = row[column.key as keyof TRow] as unknown as string;

  const onBlur = () => onClose(false);
  const onChange = (value: string) => {
    if (value === "null") {
      onRowChange({ ...row, [column.key]: null }, true);
    } else {
      onRowChange({ ...row, [column.key]: value === "true" }, true);
    }
  };

  return (
    <>
      <Select
        defaultValue={value === null ? "null" : value.toString()}
        defaultOpen
        onValueChange={onChange}
        value={value === null ? "null" : value.toString()}
      >
        <SelectTrigger
          style={{ width: `${gridColumn?.width || column.width}px` }}
          onBlur={onBlur}
          className="rounded-none"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">TRUE</SelectItem>
          <SelectItem value="false">FALSE</SelectItem>
          {isNullable && <SelectItem value="null">NULL</SelectItem>}
        </SelectContent>
      </Select>
    </>
  );
};
