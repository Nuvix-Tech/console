import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, InputNumberField, SubmitButton } from "@/components/others/forms";
import { sdkForConsole } from "@/lib/sdk";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";
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
              message: "Max allowed sessions limit updated.",
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
              <CardBoxTitle>Session Limit</CardBoxTitle>
              <CardBoxDesc>
                The maximum number of active sessions a user can have at any given time.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <InputNumberField name="limit" label="Limit" max={100} min={0} />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
