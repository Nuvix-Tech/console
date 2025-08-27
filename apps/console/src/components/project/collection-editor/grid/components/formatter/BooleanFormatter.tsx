import type { PropsWithChildren } from "react";
import type { RenderCellProps } from "react-data-grid";
import { NullValue } from "../common/NullValue";
import type { Models } from "@nuvix/console";

export const BooleanFormatter = (
  p: PropsWithChildren<RenderCellProps<Models.Document, unknown>>,
) => {
  const value = p.row[p.column.key] as boolean | null;
  if (value === null) return <NullValue />;
  return <>{value ? "TRUE" : "FALSE"}</>;
};
