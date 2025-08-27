import { PropsWithChildren } from "react";
import type { RenderCellProps } from "react-data-grid";

import { EmptyValue } from "../common/EmptyValue";
import { NullValue } from "../common/NullValue";
import type { Models } from "@nuvix/console";

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
