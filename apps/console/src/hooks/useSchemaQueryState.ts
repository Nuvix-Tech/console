import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LOCAL_STORAGE_KEYS } from "../lib/constants";

export const useQuerySchemaState = () => {
  const { id: ref } = useParams<{ id: string }>();

  const defaultSchema =
    typeof window !== "undefined" && ref && ref.length > 0
      ? window.localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_SELECTED_SCHEMA(ref)) || "public"
      : "public";

  // cache the original default schema so that it's not changed by another tab and cause issues in the app (saving a
  // table on the wrong schema)
  const originalDefaultSchema = useMemo(() => defaultSchema, [ref]);
  // const [schema, setSelectedSchema] = useIsomorphicUseQueryState(originalDefaultSchema)

  const [schema, setSelectedSchema] = useState(originalDefaultSchema);

  useEffect(() => {
    // Update the schema in local storage on every change
    if (typeof window !== "undefined" && ref && ref.length > 0) {
      window.localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SELECTED_SCHEMA(ref), schema);
    }
  }, [schema, ref]);

  return { selectedSchema: schema, setSelectedSchema };
};
