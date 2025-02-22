import { CardBox } from "@/components/others/card";
import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { getProjectState } from "@/state/project-state";
import { Card, Stack, Text } from "@chakra-ui/react";
import React from "react";
import * as y from "yup";

const schema = y.object({
  limit: y.number().min(0).optional(),
});

export const UsersLimit: React.FC = () => {
  const { project } = getProjectState();

  const onUpdate = async () => {};

  return (
    <>
      <Form
        initialValues={{
          limit: project?.authLimit,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          // try {
          //   await sdk?.users.updateEmail(user?.$id!, values.email!);
          //   addToast({
          //     variant: "success",
          //     message: "User email has been updated successfully.",
          //   });
          //   await _update();
          // } catch (e: any) {
          //   addToast({
          //     variant: "danger",
          //     message: e.message,
          //   });
          // }
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
              <Card.Title>Users</Card.Title>
              <Text textStyle={"sm"}>Update user's limit.</Text>
            </Stack>
            <Stack maxW={{ base: "full", md: "1/2" }} width={"full"}>
              <InputField label={"Users Limit"} name="limit" />
            </Stack>
          </Stack>
        </CardBox>
      </Form>
    </>
  );
};
