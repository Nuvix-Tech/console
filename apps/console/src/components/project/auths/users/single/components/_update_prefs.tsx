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
import { useProjectStore, useUserStore } from "@/lib/store";

const schema = y.object({
  prefs: y.object(),
});

export const UpdatePrefs = () => {
  const sdk = useProjectStore.use.sdk?.();
  const refresh = useUserStore.use.refresh();
  const user = useUserStore.use.user?.();
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          prefs: user?.prefs,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk?.users.updatePrefs(user?.$id!, values.prefs!);
            addToast({
              variant: "success",
              message: "User prefs have been updated successfully.",
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
                Customize user preferences to sync them across all devices and sessions.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <InputObjectField name="prefs" />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
