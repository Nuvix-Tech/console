import type { RenderEditCellProps } from "react-data-grid";
import { useTableEditorTableState } from "@/lib/store/table";
import { Select } from "@/ui/components";

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
  const { getState } = useTableEditorTableState();
  const snap = getState();
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
    <Select
      autoFocus
      id="boolean-editor"
      name="boolean-editor"
      // size="s"
      onBlur={onBlur}
      onSelect={onChange}
      defaultValue={value === null ? "null" : value.toString()}
      style={{ width: `${gridColumn?.width || column.width}px` }}
      options={[
        { label: "TRUE", value: "true" },
        { label: "FALSE", value: "false" },
        ...(isNullable ? [{ label: "NULL", value: "null" }] : []),
      ]}
      value={value === null ? "null" : value.toString()}
    />
  );
};
