import type { RenderEditCellProps } from "react-data-grid";
import { Select } from "@/components/others/ui";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";

interface SelectEditorProps<TRow, TSummaryRow = unknown>
  extends RenderEditCellProps<TRow, TSummaryRow> {
  isNullable?: boolean;
  options: { label: string; _value: string }[];
}

export function SelectEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  onClose,
  options,
  isNullable,
}: SelectEditorProps<TRow, TSummaryRow>) {
  const snap = useCollectionEditorCollectionStateSnapshot();
  const gridColumn = snap.gridColumns.find((x) => x.name == column.key);

  const value = row[column.key as keyof TRow] as unknown as string;

  const nullableValue = isNullable ? "___NULL___" : "";

  function onChange(value: string) {
    if (!value || value == nullableValue) {
      onRowChange({ ...row, [column.key]: null }, true);
    } else {
      onRowChange({ ...row, [column.key]: value }, true);
    }
  }

  function onBlur() {
    onClose(false);
  }

  return (
    <Select
      autoFocus
      id="select-editor"
      name="select-editor"
      size="md"
      defaultValue={value ? [value] : []}
      className="nx-grid-select-editor"
      style={{ width: `${gridColumn?.width || column.width}px` }}
      onValueChange={onChange}
      onBlur={onBlur}
      options={[
        ...(isNullable ? [{ label: "NULL", value: nullableValue }] : []),
        ...options.map(({ label, _value }) => ({ label, value: _value })),
      ]}
      value={value ?? nullableValue}
      placeholder={(gridColumn as any)?.defaultValue ?? ""}
    />
  );
}
