import { NumberInputField, NumberInputRoot } from "@/components/cui/number-input";
import { NumberInputValueChangeDetails } from "@chakra-ui/react";
import type { RenderEditCellProps } from "react-data-grid";

function autoFocusAndSelect(input: HTMLInputElement | null) {
  input?.focus();
  input?.select();
}

export function NumberEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  onClose,
}: RenderEditCellProps<TRow, TSummaryRow>) {
  const value = row[column.key as keyof TRow] as unknown as string;

  function onChange(details: NumberInputValueChangeDetails) {
    const _value = details.value;
    if (_value === "") onRowChange({ ...row, [column.key]: null });
    else onRowChange({ ...row, [column.key]: _value });
  }

  function onBlur() {
    onClose(true);
  }

  return (
    <NumberInputRoot
      onBlur={onBlur}
      ref={autoFocusAndSelect}
      value={value ?? ""}
      onValueChange={onChange}
      variant={"subtle"}
    >
      <NumberInputField className="sb-grid-number-editor" />
    </NumberInputRoot>
  );
}
