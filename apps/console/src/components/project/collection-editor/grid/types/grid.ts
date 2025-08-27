import type { Models } from "@nuvix/console";

export interface GridProps {
  width?: string | number;
  height?: string | number;
  defaultColumnWidth?: string | number;
  containerClass?: string;
  gridClass?: string;
  rowClass?: ((row: Models.Document) => string | undefined) | undefined;
}
