import { CustomID } from "@/components/_custom_id";
import { FormDialog, InputField, SubmitButton } from "@/components/others/forms";
import { useProjectStore } from "@/lib/store";
import { Column, useToast } from "@nuvix/ui/components";
import { useRouter } from "@bprogress/next";
import { useParams } from "next/navigation";
import * as y from "yup";

interface CreateBucketProps {
  onClose: () => void;
  isOpen: boolean;
}

const schema = y.object({
  name: y.string(),
  id: y.string().optional(),
});

export const CreateBucket = ({ onClose, isOpen }: CreateBucketProps) => {
  const sdk = useProjectStore.use.sdk();
  const { addToast } = useToast();
  const params = useParams();
  const { push } = useRouter();

  const baseURL = `/project/${params.id}/buckets`;

  return (
    <FormDialog
      dialog={{
        title: "Create Bucket",
        description: "Add a new bucket to your project",
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
            const bucket = await sdk.storage.createBucket(id, name);
            addToast({
              message: "Bucket has been successfully created",
              variant: "success",
            });
            onClose();
            push(`${baseURL}/${bucket.$id}`);
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
        <CustomID name="id" label="Bucket ID" />
      </Column>
    </FormDialog>
  );
};
