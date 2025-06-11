import { PropsWithChildren } from "react";
import type { RenderCellProps } from "react-data-grid";

import { NuvixRow } from "../../types";
import { NullValue } from "../common/NullValue";
import { convertByteaToHex } from "@/components/editor/SidePanelEditor/RowEditor/RowEditor.utils";

export const BinaryFormatter = (p: PropsWithChildren<RenderCellProps<NuvixRow, unknown>>) => {
  const value = p.row[p.column.key];
  if (!value) return <NullValue />;
  const binaryValue = convertByteaToHex(value);
  return <>{binaryValue}</>;
};
