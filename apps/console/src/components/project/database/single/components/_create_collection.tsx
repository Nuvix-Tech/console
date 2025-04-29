import { CustomID } from "@/components/_custom_id";
import { FormDialog, InputField, SubmitButton } from "@/components/others/forms";
import { useDatabaseStore, useProjectStore } from "@/lib/store";
import { Column, useToast } from "@nuvix/ui/components";
import { useRouter } from "@bprogress/next";
import { useParams } from "next/navigation";
import * as y from "yup";

interface CreateCollectionProps {
  onClose: () => void;
  isOpen: boolean;
}

const schema = y.object({
  name: y.string().required(),
  id: y.string().optional(),
});

export const CreateCollection = ({ onClose, isOpen }: CreateCollectionProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database?.();
  const { addToast } = useToast();
  const params = useParams();
  const { push } = useRouter();

  const baseURL = `/project/${params.id}/databases/${database?.$id}/collection`;

  return (
    <FormDialog
      dialog={{
        title: "Create Collection",
        description: "Add a new collection to your database",
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
            const collection = await sdk.databases.createCollection(database!.$id, id, name);
            addToast({
              message: "Collection has been successfully created",
              variant: "success",
            });
            onClose();
            push(`${baseURL}/${collection.$id}`);
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
        <CustomID name="id" label="Collection ID" />
      </Column>
    </FormDialog>
  );
};
