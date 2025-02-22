import { CardBox } from "@/components/others/card";
import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { sdkForConsole } from "@/lib/sdk";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";
import { Card, Stack, Text } from "@chakra-ui/react";
import React from "react";
import * as y from "yup";

const schema = y.object({
  limit: y.number().min(0),
});

export const SessionLimit: React.FC = () => {
  const { project, _update } = getProjectState();
  const { projects } = sdkForConsole;
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          limit: project?.authSessionsLimit,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await projects.updateAuthSessionsLimit(project?.$id!, Number(values.limit) ?? 0);
            addToast({
              variant: "success",
              message: "Max number of Sessions limit updated.",
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
              <Card.Title>Session Limit</Card.Title>
              <Text textStyle={"sm"}>
                The maximum number of active sessions a user can have at any given time.
              </Text>
            </Stack>
            <Stack maxW={{ base: "full", md: "1/2" }} width={"full"}>
              <InputField name="limit" label="Limit" />
            </Stack>
          </Stack>
        </CardBox>
      </Form>
    </>
  );
};
