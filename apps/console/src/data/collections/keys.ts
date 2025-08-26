export const collectionKeys = {
  list: (
    projectRef: string | undefined,
    params?: {
      schema?: string;
      search?: string;
      limit?: number;
    },
  ) => ["projects", projectRef, "collections", ...(params ? [params] : [])] as const,
};
