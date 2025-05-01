import { getProjectSdk } from "@/lib/sdk";
// import { Entity } from "@/types/grid";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type TableEditorArgs = {
  id: string;
  schema: string;
};

export type TableEditorVariables = TableEditorArgs & {
  sdk: ReturnType<typeof getProjectSdk>;
};

// export const useTableEditorQuery = (
//   { sdk, id, schema }: TableEditorVariables,
//   { enabled = true, queryKey, ...options }: UseQueryOptions<Entity> = { queryKey: [] },
// ) =>
//   useQuery<Entity>({
//     queryKey: ["table-editor", sdk.client.config.project, ...queryKey, id],
//     queryFn: async () => {
//       const data = await sdk.schema.getTable(id, schema);
//       data.columns = data.columns.map((column) => {
//         (column as any).format = column.type;
//         return column;
//       });
//       return data as unknown as Entity;
//     },
//     enabled,
//     ...options,
//   });
