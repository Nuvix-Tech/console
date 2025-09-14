import { PROTECTED_SCHEMAS } from "@/lib/constants";
import { useProjectStore } from "@/lib/store";

export const useIsProtectedSchema = ({ schema }: { schema: string }) => {
  const is = PROTECTED_SCHEMAS.includes(schema);
  return { isSchemaLocked: is };
};

export const useCheckSchemaType = ({
  schema,
  type,
}: {
  schema: string;
  type: "document" | "managed" | "unmanaged";
}) => {
  const schemas = useProjectStore((s) => s.schemas);
  let is = schemas.find((s) => s.name === schema && s.type === type);
  return { isSchemaType: !!is };
};

export const useGetSchemaType = () => {
  const schemas = useProjectStore((s) => s.schemas);
  const get = (schema: string) => {
    const found = schemas.find((s) => s.name === schema)?.type;
    if (found) return found;
    if (PROTECTED_SCHEMAS.includes(schema)) return "internal";
    return "unmanaged";
  };
  return { getSchemaType: get };
};
