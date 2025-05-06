import { NumberInputField, NumberInputRoot } from "@/components/cui/number-input";
import { NumberInputValueChangeDetails } from "@chakra-ui/react";
import type { RenderEditCellProps } from "react-data-grid";

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
      autoFocus
      value={value ?? ""}
      onValueChange={onChange}
      variant={"subtle"}
      size={"xs"}
      borderRadius={"none"}
    >
      <NumberInputField autoFocus className="nx-grid-number-editor" borderRadius={"none"} />
    </NumberInputRoot>
  );
}
