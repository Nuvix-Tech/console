import { PropsWithChildren } from "react";
import type { RenderCellProps } from "react-data-grid";

import { SupaRow } from "../../types";
// import { convertByteaToHex } from "components/interfaces/TableGridEditor/SidePanelEditor/RowEditor/RowEditor.utils";
import { NullValue } from "../common/NullValue";

function convertByteaToHex(bytea: string): string {
  // AI-generated code
  // Convert bytea to hex representation
  // This is a placeholder implementation. You should replace it with the actual conversion logic.
  // For example, if bytea is a string of bytes, you can convert it to hex like this:
  return bytea
    .split("")
    .map((char) => char.charCodeAt(0).toString(16))
    .join("");
}

export const BinaryFormatter = (p: PropsWithChildren<RenderCellProps<SupaRow, unknown>>) => {
  const value = p.row[p.column.key];
  if (!value) return <NullValue />;
  const binaryValue = convertByteaToHex(value);
  return <>{binaryValue}</>;
};
