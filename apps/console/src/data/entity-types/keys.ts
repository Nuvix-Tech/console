export const entityTypeKeys = {
  list: (
    projectRef: string | undefined,
    params?: {
      schemas?: string[];
      search?: string;
      sort?: "alphabetical" | "grouped-alphabetical";
      limit?: number;
      filterTypes?: string[];
      hidePermsTables?: boolean;
    },
  ) => ["projects", projectRef, "entity-types", ...(params ? [params] : [])] as const,
};
