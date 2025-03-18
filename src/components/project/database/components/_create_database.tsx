import { CustomID } from "@/components/_custom_id";
import { FormDialog, InputField, SubmitButton } from "@/components/others/forms";
import { useProjectStore } from "@/lib/store";
import { Column, useToast } from "@/ui/components";
import { useRouter } from "@bprogress/next";
import { useParams } from "next/navigation";
import * as y from "yup";

interface CreateDatabaseProps {
  onClose: () => void;
  isOpen: boolean;
}

const schema = y.object({
  name: y.string().required(),
  id: y.string().optional(),
});

export const CreateDatabase = ({ onClose, isOpen }: CreateDatabaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const { addToast } = useToast();
  const params = useParams();
  const { push } = useRouter();

  const baseURL = `/project/${params.id}/databases`;

  return (
    <FormDialog
      dialog={{
        title: "Create Database",
        description: "Add a new database to your project",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          id: "",
          name: "",
        },
        onSubmit: async (values) => {
          try {
            let { id, name } = values;
            id = id?.trim() || "unique()";
            const database = await sdk.databases.create(id, name);
            addToast({
              message: "Database has been successfully created",
              variant: "success",
            });
            onClose();
            push(`${baseURL}/${database.$id}`);
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
