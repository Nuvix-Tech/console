import { create } from "zustand";
import { createSelectors } from "../utils";
import { ModelsX } from "../external-sdk";

interface SchemaStore {
  schema?: ModelsX.Schema;
  setSchema: (schema: ModelsX.Schema) => void;

  refetch: () => Promise<void>;
  setRefetch: (refetch: () => Promise<void>) => void;
}

const useSchema = create<SchemaStore>((set) => ({
  schema: {
    $id: "public",
    name: "public",
    type: "managed",
  },
  setSchema: (schema) => set({ schema }),
  refetch: async () => {},
  setRefetch: (refetch) => set({ refetch }),
}));

export const useSchemaStore = createSelectors(useSchema);
