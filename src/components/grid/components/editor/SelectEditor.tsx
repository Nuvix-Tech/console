import type { RenderEditCellProps } from "react-data-grid";

import { useTableEditorTableState } from "@/lib/store/table";
import { Select } from "@/ui/components";

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
  const { getState } = useTableEditorTableState();
  const snap = getState();
  const gridColumn = snap.gridColumns.find((x) => x.name == column.key);

  const value = row[column.key as keyof TRow] as unknown as string;

  function onChange(value: string) {
    if (!value || value == "") {
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
      // size="s"
      defaultValue={value ?? ""}
      className="sb-grid-select-editor !gap-2"
      style={{ width: `${gridColumn?.width || column.width}px` }}
      onSelect={onChange}
      onBlur={onBlur}
      options={[
        ...(isNullable ? [{ label: "NULL", value: "" }] : []),
        ...options.map(({ label, _value }) => ({ label, value: _value })),
      ]}
      value={value ?? ""}
      placeholder={gridColumn?.defaultValue ?? ""}
    />
  );
}
