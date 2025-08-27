import { PropsWithChildren } from "react";
import type { RenderCellProps } from "react-data-grid";

import type { Models } from "@nuvix/console";
import { NullValue } from "@/components/grid/components/common/NullValue";
import { EmptyValue } from "@/components/grid/components/common/EmptyValue";

export const JsonFormatter = (p: PropsWithChildren<RenderCellProps<Models.Document, unknown>>) => {
  let value = p.row[p.column.key];

  if (value === null) return <NullValue />;
  if (value === "") return <EmptyValue />;

  try {
    const jsonValue = JSON.parse(value);
    return <>{JSON.stringify(jsonValue)}</>;
  } catch (err) {
    return <>{JSON.stringify(value)}</>;
  }
};
