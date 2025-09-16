import { NumberInputField, NumberInputRoot } from "@nuvix/cui/number-input";
import React from "react";
import type { RenderEditCellProps } from "react-data-grid";

export function NumberEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  onClose,
}: RenderEditCellProps<TRow, TSummaryRow>) {
  const value = row[column.key as keyof TRow] as unknown as string;
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleValueChange(details: { value: string; valueAsNumber: number }) {
    console.log("onValueChange fired:", details);

    if (details.value === "") {
      onRowChange({ ...row, [column.key]: null });
    } else {
      onRowChange({ ...row, [column.key]: details.value });
    }
  }

  function handleBlur() {
    onClose(true);
  }

  React.useEffect(() => {
    // Focus after everything is mounted
    inputRef.current?.focus();
    // Optionally select all content:
    inputRef.current?.select?.();
  }, []);

  return (
    <NumberInputRoot
      value={value ?? ""}
      onValueChange={handleValueChange}
      onBlur={handleBlur}
      step={1}
      clampValueOnBlur
      allowMouseWheel
      focusInputOnChange={false}
      variant="subtle"
      size="xs"
      borderRadius="none"
    >
      <NumberInputField ref={inputRef} className="nx-grid-number-editor" borderRadius="none" />
    </NumberInputRoot>
  );
}
