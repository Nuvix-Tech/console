import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { useProjectStore } from "@/lib/store";
import { useToast } from "@nuvix/ui/components";
import React from "react";
import * as y from "yup";
import { useProvider } from "./store";

const schema = y.object({
  name: y.string().optional(),
});

export const UpdateName: React.FC = () => {
  const sdk = useProjectStore.use.sdk?.();
  const { provider, refresh } = useProvider((s) => s);
  const { addToast } = useToast();

  if (!provider || !sdk) return;
  const type = provider.provider;

  return (
    <>
      <Form
        initialValues={{
          name: provider.name,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            // await sdk.messaging.update
            addToast({
              variant: "success",
              message: "Bucket updated successfully",
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
              <InputField name="name" label="name" />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
