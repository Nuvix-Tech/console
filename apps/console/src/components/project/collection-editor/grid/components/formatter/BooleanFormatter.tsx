import type { PropsWithChildren } from "react";
import type { RenderCellProps } from "react-data-grid";
import type { Models } from "@nuvix/console";
import { NullValue } from "@/components/grid/components/common/NullValue";

export const BooleanFormatter = (
  p: PropsWithChildren<RenderCellProps<Models.Document, unknown>>,
) => {
  const value = p.row[p.column.key] as boolean | null;
  if (value === null) return <NullValue />;
  return <>{value ? "TRUE" : "FALSE"}</>;
};
