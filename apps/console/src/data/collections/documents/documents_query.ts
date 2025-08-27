import type { ProjectSdk } from "@/lib/sdk.js";
import { Query, type Models, type NuvixException } from "@nuvix/console";
import { useQuery } from "@tanstack/react-query";
import { collectionKeys } from "../keys.js";
import type { QueryOptions } from "@/types/index.js";

type TableRowsVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  collectionId: string;
  schema: string;
  filters?: string[];
  sorts?: string[];
  limit?: number;
  page?: number;
};

export async function getDocuments(
  { projectRef, sdk, collectionId, filters, sorts, limit, page, schema }: TableRowsVariables,
  signal?: AbortSignal,
) {
  const queries: string[] = [];
  if (limit !== undefined) queries.push(Query.limit(limit));
  if (page !== undefined) queries.push(Query.offset((limit ?? 0) * (page - 1)));
  if (filters !== undefined) queries.push(...filters);
  if (sorts !== undefined) queries.push(...sorts);

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
