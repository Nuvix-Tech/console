import { MAX_CHARACTERS } from "@nuvix/pg-meta/src/query/table-row-query";

/**
 * Checks if the value is truncated. The JSON types are usually truncated if they're too big to show in the editor.
 */
export const isValueTruncated = (value: string | null | undefined) => {
  return value?.endsWith("...") && (value ?? "").length > MAX_CHARACTERS;
};
