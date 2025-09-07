import { FormDialog, InputField, InputTagField, SubmitButton } from "@/components/others/forms";
import { useProjectStore, useTeamStore } from "@/lib/store";
import { formValue } from "@/lib/utils";
import { Column, useToast } from "@nuvix/ui/components";
import * as y from "yup";

interface CreateMemberProps {
  onClose: () => void;
  isOpen: boolean;
  refetch?: () => void;
}

const schema = y.object({
  name: y.string().optional(),
  email: y.string().email().required(),
  roles: y.array().of(y.string()).optional(),
});

export const CreateMember = ({ onClose, isOpen, refetch }: CreateMemberProps) => {
  const sdk = useProjectStore.use.sdk();
  const team = useTeamStore.use.team!?.();
  const { addToast } = useToast();

  return (
    <FormDialog
      dialog={{
        title: "Create Member",
        description: "Add a new member to the team",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          name: "",
          email: "",
          roles: [],
        },
        onSubmit: async (values) => {
          try {
            let { name, email, roles } = values;
            await sdk.teams.createMembership(
              team!.$id,
              roles,
              email,
              undefined,
              undefined,
              undefined,
              formValue(name),
            );
            addToast({
              message: "Member created successfully",
              variant: "success",
            });
            onClose();
            refetch?.();
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
        <InputField name="email" label="Email" />
        <InputField name="name" label="Name (Optional)" />
        <InputTagField name="roles" label="Roles" />
      </Column>
    </FormDialog>
  );
};
