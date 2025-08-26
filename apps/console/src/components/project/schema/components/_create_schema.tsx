import { FormDialog, InputField, InputSelectField, SubmitButton } from "@/components/others/forms";
import { useProjectStore } from "@/lib/store";
import { useSchemaStore } from "@/lib/store/schema";
import { Column, useToast } from "@nuvix/ui/components";
import * as y from "yup";

interface CreateSchemaProps {
  onClose: () => void;
  isOpen: boolean;
}

const schema = y.object({
  name: y.string().required(),
  type: y.string().required().default("managed"),
  description: y.string().optional(),
});

export const CreateSchema = ({ onClose, isOpen }: CreateSchemaProps) => {
  const sdk = useProjectStore.use.sdk();
  const refetch = useSchemaStore.use.refetch();
  const { addToast } = useToast();

  return (
    <FormDialog
      dialog={{
        title: "Create Schema",
        description: "Create a new schema to store your data.",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          name: "",
          type: "managed",
        },
        onSubmit: async (values) => {
          try {
            let { name, type, description } = values;
            await sdk.schema.create(name, type, description);
            addToast({
              message: `Schema ${name} created successfully`,
              variant: "success",
            });
            onClose();
            await refetch();
          } catch (error: any) {
            addToast({
              message: error.message,
              variant: "danger",
            });
          }
        },
      }}
    >
      <Column paddingY="12" fillWidth gap="8">
        <InputField name="name" label="Name" />
        <InputSelectField
          name="type"
          label="Type"
          options={[
            { label: "Managed", value: "managed" },
            { label: "Unmanaged", value: "unmanaged" },
            { label: "Document", value: "document" },
          ]}
          placeholder="Select a type"
          description="Managed schemas are automatically managed by the system. Unmanaged schemas are manually managed by the user."
        />
        <InputField
          name="description"
          label="Description"
          placeholder="A short description of the schema"
        />
      </Column>
    </FormDialog>
  );
};
