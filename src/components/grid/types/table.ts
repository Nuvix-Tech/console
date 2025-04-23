import { Columns, Entity } from "@/types/grid";
import { GridForeignKey } from "./base";

export type Dictionary<T> = {
  [key: string]: T;
};

export interface SupaColumn extends Columns {
  // readonly dataType: string;
  // readonly format: string;
  // readonly name: string;
  // readonly comment?: string | null;
  // readonly defaultValue?: string | null;
  // readonly enum?: string[] | null;
  // readonly isPrimaryKey?: boolean;
  // readonly isIdentity?: boolean;
  // readonly isGeneratable?: boolean;
  // readonly isNullable?: boolean;
  // readonly isUpdatable?: boolean;
  // readonly isEncrypted?: boolean;
  // readonly foreignKey?: GridForeignKey;
  // position: number;
}

export interface SupaTable extends Entity {
  // readonly id: number;
  // readonly columns: SupaColumn[];
  // readonly name: string;
  // readonly schema?: string | null;
  // readonly comment?: string | null;
  // readonly estimateRowCount: number;
}

export interface SupaRow extends Dictionary<any> {
  readonly $id: string;
  readonly idx: number;
}
