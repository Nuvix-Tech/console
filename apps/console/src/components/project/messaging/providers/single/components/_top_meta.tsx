import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, InputSwitchField, SubmitButton } from "@/components/others/forms";
import { useProjectStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { useToast } from "@nuvix/ui/components";
import React from "react";
import * as y from "yup";
import { useProvider } from "./store";

const schema = y.object({
  is: y.boolean().required(),
});

export const TopMeta: React.FC = () => {
  const sdk = useProjectStore.use.sdk?.();
  const { provider, refresh } = useProvider((s) => s);
  const { addToast } = useToast();

  if (!provider || !sdk) return;
  const type = provider.provider;

  return (
    <>
      <Form
        initialValues={{
          is: provider.enabled,
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
              <CardBoxTitle>{provider.name}</CardBoxTitle>
            </CardBoxItem>
            <CardBoxItem>
              <InputSwitchField name="is" label="Enable / Disable" reverse />
              <CardBoxDesc>Provider: {provider.provider}</CardBoxDesc>
              <CardBoxDesc className="capitlize">Type: {provider.type}</CardBoxDesc>
              <CardBoxDesc>Created: {formatDate(provider.$createdAt)}</CardBoxDesc>
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
