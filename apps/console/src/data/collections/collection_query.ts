import { ProjectSdk } from "@/lib/sdk";
import { QueryOptions } from "@/types";
import { Models } from "@nuvix/console";
import { useQuery } from "@tanstack/react-query";
import { collectionKeys } from "./keys";

type TableEditorVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  schema: string;
  id: string;
};

export const useCollectionEditorQuery = <TData = Models.Collection>(
  { projectRef, sdk, schema, id }: TableEditorVariables,
  { enabled = true, ...options }: QueryOptions<Models.Collection, any, TData> = {},
) =>
  useQuery({
    queryKey: collectionKeys.editor(projectRef, schema, id),
    queryFn: async ({ signal }) => {
      const coll = await sdk.databases.getCollection(schema, id);
      coll.$schema = schema; // until backend support
      return coll;
    },
    enabled: enabled && typeof projectRef !== "undefined" && typeof id !== "undefined",
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
