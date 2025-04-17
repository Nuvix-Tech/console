import { create } from "zustand";
import { createSelectors } from "../utils";
import { ModelsX } from "../external-sdk";

interface SchemaStore {
  schema: ModelsX.Schema;
  setSchema: (schema: ModelsX.Schema) => void;
}

const useSchema = create<SchemaStore>((set) => ({
  schema: {
    name: "m_do",
    $id: "m_do",
    type: "managed",
  },
  setSchema: (schema) => set({ schema }),
}));

export const useSchemaStore = createSelectors(useSchema);
