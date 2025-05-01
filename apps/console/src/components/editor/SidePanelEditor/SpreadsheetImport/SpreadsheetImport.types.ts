import { Dictionary } from "@nuvix/pg-meta/src/query";

export interface SpreadsheetData {
  headers: string[];
  rows: any[];
  rowCount: number;
  columnTypeMap: Dictionary<string>;
}
