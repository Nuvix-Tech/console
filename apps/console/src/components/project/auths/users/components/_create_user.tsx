import { CustomID } from "@/components/_custom_id";
import { FormDialog, InputField, SubmitButton } from "@/components/others/forms";
import { useProjectStore } from "@/lib/store";
import { Column, useToast } from "@/ui/components";
import { useRouter } from "@bprogress/next";
import { useParams } from "next/navigation";
import * as y from "yup";

interface CreateUserProps {
  onClose: () => void;
  isOpen: boolean;
}

const schema = y.object({
  email: y.string().email().optional(),
  name: y.string().optional(),
  phone: y
    .string()
    .matches(/^\+/, "Phone must start with +")
    .max(16, "Phone number can't exceed 16 characters")
    .optional(),
  password: y.string().optional(),
  id: y.string().optional(),
});

export const CreateUser = ({ onClose, isOpen }: CreateUserProps) => {
  const sdk = useProjectStore.use.sdk();
  const { addToast } = useToast();
  const params = useParams();
  const { push } = useRouter();

  const baseURL = `/project/${params.id}/authentication/users`;

  return (
    <FormDialog
      dialog={{
        title: "Create User",
        description: "Add a new user to your project",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          id: "",
          email: "",
          phone: "",
          name: "",
          password: "",
        },
        onSubmit: async (values) => {
          try {
            let { id, email, phone, name, password } = values;
            id = id?.trim() || "unique()";
            const user = await sdk.users.create(id, email, phone, password, name);
            addToast({
              message: "User has been successfully created",
              variant: "success",
            });
            onClose();
            push(`${baseURL}/${user.$id}`);
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
        <InputField name="email" label="Email" />
        <InputField name="phone" label="Phone" />
        <InputField name="password" type="password" label="Password" />
        <CustomID name="id" label="User ID" />
      </Column>
    </FormDialog>
  );
};
