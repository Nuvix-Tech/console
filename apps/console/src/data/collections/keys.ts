export const collectionKeys = {
  list: (
    projectRef: string | undefined,
    params?: {
      schema?: string;
      search?: string;
      limit?: number;
    },
  ) => ["projects", projectRef, "collections", ...(params ? [params] : [])] as const,
  editor: (projectRef: string, schema: string, id: string) =>
    ["projects", projectRef, "collections", schema, id] as const,
};
