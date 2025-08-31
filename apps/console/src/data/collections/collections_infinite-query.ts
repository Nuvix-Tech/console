import { ProjectSdk } from "@/lib/sdk";
import { Models, Query } from "@nuvix/console";
import { useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";
import { collectionKeys } from "./keys";

type CollectionsVariables = {
  search?: string;
  limit?: number;
  page?: number;
  sdk: ProjectSdk;
  schema: string;
  projectId: string;
};

export const useCollectionsQuery = <TData = Models.CollectionList>(
  { sdk, schema, search, limit = 100, projectId }: Omit<CollectionsVariables, "page">,
  {
    enabled = true,
    ...options
  }: Omit<
    UseInfiniteQueryOptions<Models.CollectionList, any, TData>,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  > = {},
) => {
  return useInfiniteQuery<Models.CollectionList, any, TData>({
    queryKey: collectionKeys.list(projectId, { schema, search, limit }),
    queryFn: ({ signal, pageParam }) =>
      sdk.databases.listCollections(
        schema,
        [Query.limit(limit), Query.offset(((pageParam as number) ?? 0) * limit)],
        search,
      ),
    enabled: enabled && typeof projectId !== undefined,
    getNextPageParam(lastPage, pages) {
      const page = pages.length;
      const currentTotalCount = page * limit;
      const totalCount = lastPage.total;

      if (currentTotalCount >= totalCount) {
        return undefined;
      }

      return page;
    },
    initialPageParam: undefined,
    ...options,
  });
};
