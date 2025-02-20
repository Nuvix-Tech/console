import { Form, InputObjectField, SubmitButton } from "@/components/others/forms";
import { CardBox } from "@/components/others/card";
import { getTeamPageState } from "@/state/page";
import { Card, Stack, Text } from "@chakra-ui/react";
import * as y from "yup";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";

const schema = y.object({
  prefs: y.object(),
});

export const UpdatePrefs = () => {
  const { team, _update } = getTeamPageState();
  const { sdk } = getProjectState();
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          prefs: team?.prefs,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk?.teams.updatePrefs(team?.$id!, values.prefs!);
            addToast({
              variant: "success",
              message: "Team prefs have been updated successfully.",
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
              <Card.Title>Preferences</Card.Title>
              <Text textStyle={"sm"}>
                Update your team's preferences to ensure shared information is easily accessible to
                all members.
              </Text>
            </Stack>
            <Stack maxW={{ base: "full", md: "1/2" }} width={"full"}>
              <InputObjectField label={"Preferences"} name="prefs" />
            </Stack>
          </Stack>
        </CardBox>
      </Form>
    </>
  );
};
