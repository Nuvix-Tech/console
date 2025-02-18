import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { CardBox } from "@/components/others/card";
import { getUserPageState } from "@/state/page";
import { Card, Stack, Text } from "@chakra-ui/react";
import * as y from "yup";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";

const schema = y.object({
  phone: y
    .string()
    .matches(
      /^\+\d{1,15}$/,
      "Phone number must start with '+' and can have a maximum of 15 digits.",
    )
    .required("Phone number is required"),
});

export const UpdatePhone = () => {
  const { user, _update } = getUserPageState();
  const { sdk } = getProjectState();
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          phone: user?.phone,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk?.users.updatePhone(user?.$id!, values.phone!);
            addToast({
              variant: "success",
              message: "User phone has been updated successfully.",
            });
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
              <Card.Title>Phone</Card.Title>
              <Text textStyle={"sm"}>
                Please enter the user's phone number. The phone number must start with '+' and can
                have a maximum of 15 digits, for example: +14155552671.
              </Text>
            </Stack>
            <Stack maxW={{ base: "full", md: "1/2" }} width={"full"}>
              <InputField label={"Phone Number"} name="phone" />
            </Stack>
          </Stack>
        </CardBox>
      </Form>
    </>
  );
};
