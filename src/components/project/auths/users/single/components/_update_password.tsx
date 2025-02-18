import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { CardBox } from "@/components/others/card";
import { getUserPageState } from "@/state/page";
import { Card, Stack, Text } from "@chakra-ui/react";
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
          <Stack direction={{ base: "column", md: "row" }} width={"full"} gap={"8"}>
            <Stack maxW={{ base: "full", md: "1/2" }} width={"full"} gap={"4"}>
              <Card.Title>New Password</Card.Title>
              <Text textStyle={"sm"}>
                Please enter a new password for the user. The password must be at least 8 characters
                long.
              </Text>
            </Stack>
            <Stack maxW={{ base: "full", md: "1/2" }} width={"full"}>
              <InputField label={"Password"} name="password" type="password" />
            </Stack>
          </Stack>
        </CardBox>
      </Form>
    </>
  );
};
