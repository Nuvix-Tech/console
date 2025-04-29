import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { useDatabaseStore, useProjectStore } from "@/lib/store";
import { useToast } from "@nuvix/ui/components";
import React from "react";
import * as y from "yup";

const schema = y.object({
  name: y.string().min(0).max(256).required(),
});

export const UpdateName: React.FC = () => {
  const sdk = useProjectStore.use.sdk?.();
  const refresh = useDatabaseStore.use.refresh();
  const database = useDatabaseStore.use.database?.();

  const { addToast } = useToast();

  if (!database || !sdk) return;

  return (
    <>
      <Form
        initialValues={{
          name: database.name,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            // await sdk.databases.update(database.$id, values.name, database.enabled);
            addToast({
              variant: "success",
              message: "Database updated",
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
              <CardBoxTitle>Name</CardBoxTitle>
            </CardBoxItem>
            <CardBoxItem>
              <InputField name="name" label="Name" />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
