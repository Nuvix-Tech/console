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
  documents: (
    projectRef: string,
    schema: string,
    collectionId: string,
    params?: Record<string, any>,
  ) =>
    [
      "projects",
      projectRef,
      "collections",
      schema,
      collectionId,
      "documents",
      { ...params },
    ] as const,
  documentsCount: (projectRef: string, schema: string, collectionId: string) =>
    ["projects", projectRef, "collections", schema, collectionId, "documents", "count"] as const,
};
