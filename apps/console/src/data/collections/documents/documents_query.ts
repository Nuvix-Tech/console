import type { ProjectSdk } from "@/lib/sdk";
import { Query, type Models, type NuvixException } from "@nuvix/console";
import { useQuery } from "@tanstack/react-query";
import { collectionKeys } from "../keys";
import type { QueryOptions } from "@/types/index";
import type { Filter, Sort } from "@/components/project/collection-editor/grid/types";
import { Attributes } from "@/components/project/collection-editor/SidePanelEditor/ColumnEditor/utils";

type TableRowsVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  collection: Models.Collection;
  schema: string;
  filters?: Filter[];
  populate?: string[];
  sorts?: Sort[];
  limit?: number;
  page?: number;
};

function convertFiltersToQueries(filters: Filter[]): string[] {
  const groupedFilters: Record<string, Filter[]> = {};

  // Group filters by column and operator
  filters.forEach((filter) => {
    const key = `${filter.column}-${filter.operator}`;
    if (!groupedFilters[key]) {
      groupedFilters[key] = [];
    }
    groupedFilters[key].push(filter);
  });

  const queries: string[] = [];

  Object.values(groupedFilters).forEach((group) => {
    if (group.length > 1 && group[0].operator === "equal") {
      // Combine multiple equal filters for the same column into one with array values
      const column = group[0].column;
      const values = group.map((f) => f.value);
      queries.push(Query.equal(column, values));
    } else {
      // Handle each filter individually
      group.forEach((filter) => {
        const { column, operator, value } = filter;
        switch (operator) {
          case "equal":
            queries.push(Query.equal(column, value));
            break;
          case "notEqual":
            queries.push(Query.notEqual(column, value));
            break;
          case "greaterThan":
            queries.push(Query.greaterThan(column, value));
            break;
          case "lessThan":
            queries.push(Query.lessThan(column, value));
            break;
          case "greaterThanEqual":
            queries.push(Query.greaterThanEqual(column, value));
            break;
          case "lessThanEqual":
            queries.push(Query.lessThanEqual(column, value));
            break;
          case "between":
            queries.push(
              Query.between(column, value?.split(",", 2)?.[0], value?.split(",", 2)?.[1]),
            );
            break;
          case "startsWith":
            queries.push(Query.startsWith(column, value));
            break;
          case "endsWith":
            queries.push(Query.endsWith(column, value));
            break;
          case "contains":
            queries.push(Query.contains(column, value));
            break;
          case "isNull":
            queries.push(Query.isNull(column));
            break;
          case "isNotNull":
            queries.push(Query.isNotNull(column));
            break;
          default:
            throw new Error(`Unsupported operator: ${operator}`);
        }
      });
    }
  });

  return queries;
}

function convertSortsToQueries(sorts: Sort[]): string[] {
  return sorts.map((sort) => {
    const { column, ascending = true } = sort;
    return ascending ? Query.orderAsc(column) : Query.orderDesc(column);
  });
}

export async function getDocuments(
  {
    projectRef,
    sdk,
    collection,
    filters,
    sorts,
    limit,
    page,
    schema,
    populate,
  }: TableRowsVariables,
  signal?: AbortSignal,
) {
  const queries: string[] = [];
  if (limit !== undefined) queries.push(Query.limit(limit));
  if (page !== undefined) queries.push(Query.offset((limit ?? 0) * (page - 1)));
  if (filters !== undefined) queries.push(...convertFiltersToQueries(filters));
  if (sorts !== undefined) queries.push(...convertSortsToQueries(sorts));

  if (populate === undefined) {
    const relationships = collection.attributes.filter(
      (a) => a.type === Attributes.Relationship && a.status === "available",
    );
    relationships.forEach((rel) => {
      queries.push(Query.populate(rel.key, [Query.select(["$id"])]));
    });
  }

  return sdk.databases.listDocuments(schema, collection.$id, queries);
}

export const useCollectionDocumentsQuery = <TData = Models.DocumentList<any>>(
  { projectRef, sdk, collection, schema, ...args }: Omit<TableRowsVariables, "queryClient">,
  {
    enabled = true,
    ...options
  }: QueryOptions<Models.DocumentList<any>, NuvixException, TData> = {},
) => {
  return useQuery({
    queryKey: collectionKeys.documents(projectRef, schema, collection.$id, {
      filters: args.filters,
      sorts: args.sorts,
      limit: args.limit,
      page: args.page,
      populate: args.populate,
    }),

    queryFn: ({ signal }) => getDocuments({ projectRef, sdk, collection, schema, ...args }, signal),

    enabled: enabled && typeof projectRef !== "undefined" && typeof collection.$id !== "undefined",
    ...options,
  });
};
