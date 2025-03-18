import { CustomID } from "@/components/_custom_id";
import { FormDialog, InputField, SubmitButton } from "@/components/others/forms";
import { useCollectionStore, useDatabaseStore, useProjectStore } from "@/lib/store";
import { Column, Row, useToast } from "@/ui/components";
import * as y from "yup";
import { AttributeIcon } from "./_attribute_icon";

interface BaseProps {
  onClose: () => void;
  isOpen: boolean;
  refetch: () => Promise<void>;
}

export const StringAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const { addToast } = useToast();

  const schema = y.object({
    key: y
      .string()
      .required()
      .matches(
        /^[a-zA-Z0-9][a-zA-Z0-9\-_.]*$/,
        "Key must contain only alphanumeric, hyphen, non-leading underscore, period",
      ),
    size: y.number().positive().integer().required(),
    default: y.string().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
  });

  return (
    <FormDialog
      dialog={{
        title: <Row gap="8">{AttributeIcon({ format: "string" })} Create String Attribute</Row>,
        description: "Create a new string attribute for this collection",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          key: "",
          size: 0,
          default: "",
          required: false,
          array: false,
        },
        onSubmit: async (values) => {
          try {
            const { key, size, default: defaultValue, required, array } = values;
            await sdk.databases.createStringAttribute(
              database!.$id,
              collection!.$id,
              key,
              size,
              required,
              defaultValue,
              array,
            );
            addToast({
              message: "Attribute created successfully",
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
        <CustomID name="id" label="Database ID" />
      </Column>
    </FormDialog>
  );
};
