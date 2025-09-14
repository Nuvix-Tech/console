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
  return { isSchemaType: is };
};
