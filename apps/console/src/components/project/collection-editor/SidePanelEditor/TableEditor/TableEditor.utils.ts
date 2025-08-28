import type { CollectionField } from "./TableEditor.types";
import type { Models } from "@nuvix/console";

export const validateFields = (field: CollectionField) => {
  const errors = {} as any;
  if (field.name.length === 0) {
    errors["name"] = "Please assign a name for your table";
  }
  return errors;
};

export const generateCollectionField = (): CollectionField => {
  return {
    $id: "",
    name: "",
  };
};

export const generateCollectionFieldFromCollection = (
  collection: Models.Collection,
  isDuplicating = false,
): CollectionField => {
  return {
    $id: collection.$id,
    name: isDuplicating ? `${collection.name}_duplicate` : collection.name,
  };
};
