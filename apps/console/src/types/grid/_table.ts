export interface Entity {
  $id: string;
  id: number;
  name: string;
  schema: string;
  comment?: string;
  rls?: boolean;
  cls?: boolean;
  $permissions?: string[];
  storage_parameters?: {
    fillfactor?: number;
  };
  partition?: {
    strategy: "RANGE" | "LIST" | "HASH";
    column: string;
    partitions: {
      name: string;
      values: Record<string, any>;
      parent?: string;
    }[];
  };
  inherits?: string[];
  columns: Columns[];
  indexes: {
    name: string;
    columns: string[];
    type: "BTREE" | "GIN" | "HASH" | "BRIN" | "GIST";
    unique?: boolean;
    where?: string;
    concurrently?: boolean;
  }[];
}

export interface Columns {
  id: number;
  name: string;
  type: string;
  format: string;
  primary_key?: boolean;
  comment?: string;
  default?: any;
  not_null?: boolean;
  unique?: boolean;
  array?: boolean;
  collation?: string;
  enum?: boolean;
  elements?: string[];
  $permissions?: Record<string, any>;
  compression?: "lz4" | "pglz";
  generated?: "ALWAYS" | "STORED";
  validation?: {
    min?: number;
    max?: number;
    regex?: string;
  };
  references?: {
    schema: string;
    table: string;
    column: string;
    onDelete?: "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION";
    onUpdate?: "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION";
  };
}

export type Column = Columns;
