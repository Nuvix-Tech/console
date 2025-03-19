import { FormDialog, InputField, SelectObjectField, SubmitButton } from "@/components/others/forms";
import { useCollectionStore, useDatabaseStore, useProjectStore } from "@/lib/store";
import { Column, useToast } from "@/ui/components";
import * as y from "yup";
import { DynamicField } from "../document/components";

interface CreateIndexProps {
  onClose: () => void;
  isOpen: boolean;
  refetch?: () => Promise<void>;
}

const generateSchema = () => {
  return y.object({
    key: y.string().required("Key is required"),
    type: y.string().oneOf(["key", "unique", "fulltext"]).required("Index type is required"),
    fields: y
      .array()
      .of(
        y
          .mixed()
          .test("is-valid-sort-field", "Each attribute must have a valid sort order", (value) => {
            if (!value || typeof value !== "object" || Array.isArray(value)) {
              return false;
            }

            const keys = Object.keys(value);

            if (keys.length !== 1) {
              return false;
            }

            const sortValue = (value as any)[keys[0]];
            return sortValue === "asc" || sortValue === "desc";
          }),
      )
      .min(1, "At least one field must be added"),
  });
};

export const CreateIndex = ({ onClose, isOpen, refetch }: CreateIndexProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database?.();
  const collection = useCollectionStore.use.collection?.()!;
  const { addToast } = useToast();

  return (
    <FormDialog
      dialog={{
        title: "Create Index",
        description: "Create a new index for this collection",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: generateSchema(),
        initialValues: {
          key: "",
          type: "key",
          fields: [],
        },
        onSubmit: async (values) => {
          try {
            const { key, type, fields } = values;

            const { attributes, orders } = fields.reduce(
              (acc: any, field: any) => {
                const [key, value] = Object.entries(field)[0];
                acc.attributes.push(key);
                acc.orders.push(value);
                return acc;
              },
              { attributes: [], orders: [] },
            );

            await sdk.databases.createIndex(
              database?.$id!,
              collection.$id,
              key,
              type,
              attributes,
              orders,
            );

            addToast({
              message: "Index created successfully",
              variant: "success",
            });

            if (refetch) await refetch();
            onClose();
          } catch (error: any) {
            addToast({
              message: error.message,
              variant: "danger",
            });
          }
        },
      }}
    >
      <Column paddingY="12" fillWidth gap="16">
        <InputField name="key" label="Key" />

        <DynamicField
          type="enum"
          name="type"
          options={[
            { value: "key", label: "Key" },
            { value: "unique", label: "Unique" },
            { value: "fulltext", label: "Fulltext" },
          ]}
        />

        <SelectObjectField
          name="fields"
          left={{
            label: "Attribute",
            options: [
              { label: "$id", value: "$id" },
              { label: "$createdAt", value: "$createdAt" },
              { label: "$updatedAt", value: "$updatedAt" },
              ...collection.attributes.map((attr: any) => ({
                label: attr?.key,
                value: attr?.key,
              })),
            ],
          }}
          right={{
            label: "Order",
            options: [
              { label: "Ascending", value: "asc" },
              { label: "Descending", value: "desc" },
            ],
          }}
          addText="Add Attribute"
        />
      </Column>
    </FormDialog>
  );
};
