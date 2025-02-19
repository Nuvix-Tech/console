import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { CardBox } from "@/components/others/card";
import { getTeamPageState } from "@/state/page";
import { Card, Stack } from "@chakra-ui/react";
import * as y from "yup";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";

const schema = y.object({
  name: y.string().max(256),
});

export const UpdateName = () => {
  const { team, _update } = getTeamPageState();
  const { sdk } = getProjectState();
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          name: team?.name,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk?.teams.updateName(team?.$id!, values.name!);
            addToast({
              variant: "success",
              message: "Team name has been updated successfully.",
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
              <Card.Title>Name</Card.Title>
            </Stack>
            <Stack maxW={{ base: "full", md: "1/2" }} width={"full"}>
              <InputField label={"Name"} name="name" />
            </Stack>
          </Stack>
        </CardBox>
      </Form>
    </>
  );
};
