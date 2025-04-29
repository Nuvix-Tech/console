import { Form, InputObjectField, SubmitButton } from "@/components/others/forms";
import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import * as y from "yup";
import { useToast } from "@nuvix/ui/components";
import { useProjectStore, useTeamStore } from "@/lib/store";

const schema = y.object({
  prefs: y.object(),
});

export const UpdatePrefs = () => {
  const sdk = useProjectStore.use.sdk?.();
  const refresh = useTeamStore.use.refresh();
  const team = useTeamStore.use.team?.();
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
            await refresh();
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
              <CardBoxTitle>Preferences</CardBoxTitle>
              <CardBoxDesc>
                Update your team's preferences to ensure shared information is easily accessible to
                all members.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <InputObjectField label={"Preferences"} name="prefs" />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
