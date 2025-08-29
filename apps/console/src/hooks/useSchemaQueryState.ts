import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { LOCAL_STORAGE_KEYS } from "../lib/constants";

/**
 * This hook wraps useQueryState because useQueryState imports app router for some reason which breaks the SSR in
 * the playwright tests. I've localized the issue to "NODE_ENV='test'" in the playwright tests.
 */
const useIsomorphicUseQueryState = (defaultSchema: string, type?: "doc") => {
  if (typeof window === "undefined") {
    return [defaultSchema, () => {}] as const;
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useQueryState(type === 'doc' ? "docSchema" : "schema", parseAsString.withDefault(defaultSchema));
  }
};

export const useQuerySchemaState = (type?: "doc") => {
  const { id: ref } = useParams<{ id: string; }>();
  let _schema = type === 'doc' ? '' : 'public';

  const defaultSchema =
    typeof window !== "undefined" && ref && ref.length > 0
      ? window.localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_SELECTED_SCHEMA(ref, type)) || _schema
      : _schema;

  // cache the original default schema so that it's not changed by another tab and cause issues in the app (saving a
  // table on the wrong schema)
  const originalDefaultSchema = useMemo(() => defaultSchema, [ref]);
  const [schema, setSelectedSchema] = useIsomorphicUseQueryState(originalDefaultSchema, type);

  useEffect(() => {
    // Update the schema in local storage on every change
    if (typeof window !== "undefined" && ref && ref.length > 0) {
      window.localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SELECTED_SCHEMA(ref, type), schema);
    }
  }, [schema, ref]);

  return { selectedSchema: schema, setSelectedSchema };
};
