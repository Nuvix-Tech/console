import { create } from "zustand";
import { createSelectors } from "../utils";
import { ModelsX, SchemaType } from "../external-sdk";

interface SchemaStore {
  schema?: ModelsX.Schema;
  setSchema: (schema: ModelsX.Schema) => void;

  refetch: () => Promise<void>;
  setRefetch: (refetch: () => Promise<void>) => void;
}

/**
 * @deprecated use `useSchemaQueryState` instead
 */
const useSchema = create<SchemaStore>((set) => ({
  schema: {
    $id: "public",
    name: "public",
    type: SchemaType.Managed,
  },
  setSchema: (schema) => set({ schema }),
  refetch: async () => {},
  setRefetch: (refetch) => set({ refetch }),
}));

/**
 * @deprecated use `useSchemaQueryState` instead
 */
export const useSchemaStore = createSelectors(useSchema);
