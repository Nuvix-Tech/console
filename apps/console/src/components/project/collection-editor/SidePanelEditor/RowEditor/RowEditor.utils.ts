import type { Models } from "@nuvix/console";
import { MAX_CHARACTERS } from "@nuvix/pg-meta/src/query/table-row-query";

/**
 * Checks if the value is truncated. The JSON types are usually truncated if they're too big to show in the editor.
 */
export const isValueTruncated = (value: string | null | undefined) => {
  return value?.endsWith("...") && (value ?? "").length > MAX_CHARACTERS;
};

export const generateRowFromCollection = (collection: Models.Collection) => {
  const row: Record<string, any> = {};

  if (collection.attributes) {
    for (const attr of collection.attributes) {
      let value: any = attr.default;

      if (value === undefined && attr.required) {
        switch (attr.type) {
          case "string":
            value = "";
            break;
          case "number":
            value = 0;
            break;
          case "boolean":
            value = false;
            break;
          default:
            value = null;
        }
      } else {
        switch (attr.type) {
          case "number":
            value = parseFloat(value);
            break;
          case "boolean":
            value = value?.toLowerCase() === "true";
            break;
          case "string":
            break;
          default:
            try {
              value = JSON.parse(value);
            } catch {
              // keep as string if not parseable
            }
        }
      }

      if (attr.array) {
        value = Array.isArray(value) ? value : [value];
      }

      row[attr.key] = value;
    }
  }

  return row;
};
