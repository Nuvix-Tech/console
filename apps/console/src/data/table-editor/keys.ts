export const tableEditorKeys = {
  tableEditor: (projectRef: string | undefined, id: number | undefined) =>
    ["projects", projectRef, "table-editor", id] as const,
  tablePermissions: (projectRef: string | undefined, schema: string, table: string) =>
    ["projects", projectRef, "table-editor", schema, table, "permissions"] as const,
};
