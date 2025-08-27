import { PropsWithChildren } from "react";
import type { RenderCellProps } from "react-data-grid";

import type { Models } from "@nuvix/console";
import { NullValue } from "@/components/grid/components/common/NullValue";
import { EmptyValue } from "@/components/grid/components/common/EmptyValue";

export const DefaultFormatter = (
  p: PropsWithChildren<RenderCellProps<Models.Document, unknown>>,
) => {
  let value = p.row[p.column.key];
  if (value === null) return <NullValue />;
  if (value === "") return <EmptyValue />;
  if (typeof value == "object" || Array.isArray(value)) {
    value = JSON.stringify(value);
  }
  return <>{value}</>;
};
