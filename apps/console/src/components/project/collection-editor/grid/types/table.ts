import { GridForeignKey } from "./base";
import { Dictionary } from "./query";

// export type { Columns as NuvixColumn } from "@/types/grid";
export interface NuvixColumn {
  readonly dataType: string;
  readonly format: string;
  readonly name: string;
  readonly comment?: string | null;
  readonly defaultValue?: string | null;
  readonly enum?: string[] | null;
  readonly isPrimaryKey?: boolean;
  readonly isIdentity?: boolean;
  readonly isGeneratable?: boolean;
  readonly isNullable?: boolean;
  readonly isUpdatable?: boolean;
  readonly isEncrypted?: boolean;
  readonly foreignKey?: GridForeignKey;
  position: number;
}

export interface NuvixTable {
  readonly id: number;
  readonly columns: NuvixColumn[];
  readonly name: string;
  readonly schema?: string | null;
  readonly comment?: string | null;
  readonly estimateRowCount: number;
}

export interface NuvixRow extends Dictionary<any> {
  readonly idx: number;
}
