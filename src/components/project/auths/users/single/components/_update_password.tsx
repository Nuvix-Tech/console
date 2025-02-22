import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { CardBox, CardBoxBody, CardBoxDesc, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { getUserPageState } from "@/state/page";
import * as y from "yup";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";

const schema = y.object({
  password: y.string().min(8),
});

export const UpdatePassword = () => {
  const { user, _update } = getUserPageState();
  const { sdk } = getProjectState();
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          password: "",
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values, { resetForm }) => {
          try {
            await sdk?.users.updatePassword(user?.$id!, values.password!);
            addToast({
              variant: "success",
              message: "Password has been updated successfully.",
            });
            resetForm();
            await _update();
          } catch (e: any) {
            addToast({
              variant: "danger",
              message: e.message,
            });
          }
        }}
      >
        <CardBox
          actions={
            <>
              <SubmitButton loadingText={"Updating..."}>Update</SubmitButton>
            </>
          }
        >
          <CardBoxBody>
            <CardBoxItem gap={"4"}>
              <CardBoxTitle>New Password</CardBoxTitle>
              <CardBoxDesc>
                Please enter a new password for the user. The password must be at least 8 characters
                long.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem >
              <InputField label={"Password"} name="password" type="password" />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
