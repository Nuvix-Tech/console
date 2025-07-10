import { FormDialog, InputField, InputSelectField, SubmitButton } from "@/components/others/forms";
import { sdkForConsole } from "@/lib/sdk";
import { useAppStore } from "@/lib/store";
import { Column, useToast } from "@nuvix/ui/components";
import * as y from "yup";

interface InviteMemberProps {
  onClose: () => void;
  isOpen: boolean;
  refetch?: () => void;
}

const schema = y.object({
  name: y.string().optional(),
  email: y.string().email().required(),
  roles: y.string().required(),
});

export const InviteMember = ({ onClose, isOpen, refetch }: InviteMemberProps) => {
  const { organization } = useAppStore((s) => s);
  const { addToast } = useToast();

  return (
    <FormDialog
      dialog={{
        title: "Invite Member",
        description: "Invite a new member to the organization.",
        isOpen,
        onClose,
        footer: <SubmitButton label="Invite" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          name: "",
          email: "",
          roles: "developer",
        },
        onSubmit: async (values) => {
          try {
            let { name, email, roles } = values;
            await sdkForConsole.organizations.createMembership(
              organization!.$id,
              [roles],
              email,
              undefined,
              undefined,
              undefined,
              name,
            );
            addToast({
              message: "Invitation sent successfully",
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
      <Column paddingY="12" fillWidth gap="16">
        <InputField name="email" label="Email" />
        <InputField name="name" label="Name (Optional)" />
        <InputSelectField
          name="roles"
          label="Roles"
          options={[
            { label: "Owner", value: "owner" },
            { label: "Developer", value: "developer" },
            { label: "Editor", value: "editor" },
            { label: "Billing", value: "billing" },
          ]}
        />
      </Column>
    </FormDialog>
  );
};
