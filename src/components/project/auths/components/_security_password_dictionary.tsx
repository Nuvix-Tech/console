import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, InputSwitchField, SubmitButton } from "@/components/others/forms";
import { sdkForConsole } from "@/lib/sdk";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";
import React from "react";
import * as y from "yup";

const schema = y.object({
  is: y.boolean().required(),
});

export const PasswordDictionary: React.FC = () => {
  const { project, _update } = getProjectState();
  const { projects } = sdkForConsole;
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          is: project?.authPasswordDictionary,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await projects.updateAuthPasswordHistory(project?.$id!, Number(values.is) ?? 0);
            addToast({
              variant: "success",
              message: "Password history updated successfully.",
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
          <CardBoxBody>
            <CardBoxItem gap={"4"}>
              <CardBoxTitle>Password dictionary</CardBoxTitle>
              <CardBoxDesc>
                Enabling this option prevent users from setting insecure passwords by comparing the
                user's password with the 10k most commonly used passwords.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <InputSwitchField name="is" />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
