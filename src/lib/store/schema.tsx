import { create } from "zustand";
import { createSelectors } from "../utils";
import { ModelsX } from "../external-sdk";

interface SchemaStore {
  schema?: ModelsX.Schema;
  setSchema: (schema: ModelsX.Schema) => void;
}

const useSchema = create<SchemaStore>((set) => ({
  schema: undefined,
  setSchema: (schema) => set({ schema }),
}));

export const useSchemaStore = createSelectors(useSchema);
