import type { ProjectSdk } from "@/lib/sdk";
import { Query, type Models, type NuvixException } from "@nuvix/console";
import { useQuery } from "@tanstack/react-query";
import { collectionKeys } from "../keys";
import type { QueryOptions } from "@/types/index";
import type { Filter, Sort } from "@/components/project/collection-editor/grid/types";

type TableRowsVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  collectionId: string;
  schema: string;
  filters?: Filter[];
  sorts?: Sort[];
  limit?: number;
  page?: number;
};

function convertFiltersToQueries(filters: Filter[]): string[] {
  return filters.map((filter) => {
    const { column, operator, value } = filter;
    switch (operator) {
      case "equal":
        return Query.equal(column, value);
      case "notEqual":
        return Query.notEqual(column, value);
      case "greaterThan":
        return Query.greaterThan(column, value);
      case "lessThan":
        return Query.lessThan(column, value);
      case "greaterThanEqual":
        return Query.greaterThanEqual(column, value);
      case "lessThanEqual":
        return Query.lessThanEqual(column, value);
      case "between":
        return Query.between(column, value?.split(",", 2)?.[0], value?.split(",", 2)?.[1]);
      case "startsWith":
        return Query.startsWith(column, value);
      case "endsWith":
        return Query.endsWith(column, value);
      case "contains":
        return Query.search(column, value);
      case "isNull":
        return Query.isNull(column);
      case "isNotNull":
        return Query.isNotNull(column);
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  });
}

function convertSortsToQueries(sorts: Sort[]): string[] {
  return sorts.map((sort) => {
    const { column, ascending = true } = sort;
    return ascending ? Query.orderAsc(column) : Query.orderDesc(column);
  });
}

export async function getDocuments(
  { projectRef, sdk, collectionId, filters, sorts, limit, page, schema }: TableRowsVariables,
  signal?: AbortSignal,
) {
  const queries: string[] = [];
  if (limit !== undefined) queries.push(Query.limit(limit));
  if (page !== undefined) queries.push(Query.offset((limit ?? 0) * (page - 1)));
  if (filters !== undefined) queries.push(...convertFiltersToQueries(filters));
  if (sorts !== undefined) queries.push(...convertSortsToQueries(sorts));

  return sdk.databases.listDocuments(schema, collectionId, queries);
}

export const useCollectionDocumentsQuery = <TData = Models.DocumentList<any>>(
  { projectRef, sdk, collectionId, schema, ...args }: Omit<TableRowsVariables, "queryClient">,
  {
    enabled = true,
    ...options
  }: QueryOptions<Models.DocumentList<any>, NuvixException, TData> = {},
) => {
  return useQuery({
    queryKey: collectionKeys.documents(projectRef, schema, collectionId),

    queryFn: ({ signal }) =>
      getDocuments({ projectRef, sdk, collectionId, schema, ...args }, signal),

    enabled: enabled && typeof projectRef !== "undefined" && typeof collectionId !== "undefined",
    ...options,
  });
};
