import { CustomID } from "@/components/_custom_id";
import { FormDialog, InputField, SubmitButton } from "@/components/others/forms";
import { useProjectStore } from "@/lib/store";
import { Column, useToast } from "@/ui/components";
import { useRouter } from "@bprogress/next";
import { useParams } from "next/navigation";
import * as y from "yup";

interface CreateTeamProps {
  onClose: () => void;
  isOpen: boolean;
}

const schema = y.object({
  name: y.string().required(),
  id: y.string().optional(),
});

export const CreateTeam = ({ onClose, isOpen }: CreateTeamProps) => {
  const sdk = useProjectStore.use.sdk();
  const { addToast } = useToast();
  const params = useParams();
  const { push } = useRouter();

  const baseURL = `/project/${params.id}/authentication/teams`;

  return (
    <FormDialog
      dialog={{
        title: "Create Team",
        description: "Add a new team to your project",
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
            const team = await sdk.teams.create(id, name);
            addToast({
              message: "Team has been successfully created",
              variant: "success",
            });
            onClose();
            push(`${baseURL}/${team.$id}`);
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
        <CustomID name="id" label="Team ID" />
      </Column>
    </FormDialog>
  );
};
