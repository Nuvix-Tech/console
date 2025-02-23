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
import { Column, Switch, useToast } from "@/ui/components";
import { Text } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import React from "react";
import * as y from "yup";

const schema = y.object({
  length: y.number().min(0),
});

type TSchema = y.InferType<typeof schema>;

export const PasswordHistory: React.FC = () => {
  const { project, _update } = getProjectState();
  const { projects } = sdkForConsole;
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          length: project?.authPasswordHistory,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await projects.updateAuthPasswordHistory(project?.$id!, Number(values.length) ?? 0);
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
              <CardBoxTitle>Password history</CardBoxTitle>
              <CardBoxDesc>
                Enabling this option prevents users from reusing recent passwords by comparing the
                new password with their password history.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <PasswordHistoryField />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};

const PasswordHistoryField = () => {
  const { values, setFieldValue } = useFormikContext<TSchema>();

  return (
    <Column gap="16">
      <Switch
        isChecked={!!values.length}
        onToggle={() => {
          setFieldValue("length", values.length === 0 ? 5 : 0);
        }}
        label="Password history"
      />

      <Text textStyle="sm">
        Set the maximum number of passwords saved per user. Maximum 20 passwords.
      </Text>

      <InputNumberField name="length" label="Limit" min={0} max={20} disabled={!values.length} />
    </Column>
  );
};
