export interface Sort {
  table: string;
  column: string;
  ascending?: boolean;
  nullsFirst?: boolean;
}

export type FilterOperator =
  | "equal"
  | "notEqual"
  | "greaterThan"
  | "lessThan"
  | "greaterThanEqual"
  | "lessThanEqual"
  | "between"
  | "startsWith"
  | "endsWith"
  | "contains"
  | "isNull"
  | "isNotNull";

export interface Filter {
  column: string;
  operator: FilterOperator;
  value: any;
}

export interface Dictionary<T> {
  [Key: string]: T;
}

export interface QueryTable {
  name: string;
  schema: string;
}

export interface QueryPagination {
  limit: number;
  offset: number;
}
