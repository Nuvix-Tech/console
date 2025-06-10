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

  async function onSubmit(values: { name: string }) {
    if (!provider || !sdk) return;

    try {
      let res: any = {} as any;
      switch (provider.type) {
        case "email":
          switch (provider.provider) {
            case "mailgun":
              res = await sdk.messaging.updateMailgunProvider(
                provider.$id,
                values.name, // name
              );
              break;
            case "sendgrid":
              res = await sdk.messaging.updateSendgridProvider(
                provider.$id,
                values.name, // name
              );
              break;
            case "smtp":
              res = await sdk.messaging.updateSmtpProvider(
                provider.$id,
                values.name, // name
              );
              break;
            default:
              throw new Error(`Unsupported email provider: ${provider.provider}`);
          }
          break;
        case "sms":
          switch (provider.provider) {
            case "twilio":
              res = await sdk.messaging.updateTwilioProvider(
                provider.$id,
                values.name, // name
              );
              break;
            case "msg91":
              res = await sdk.messaging.updateMsg91Provider(
                provider.$id,
                values.name, // name
              );
              break;
            case "telesign":
              res = await sdk.messaging.updateTelesignProvider(
                provider.$id,
                values.name, // name
              );
              break;
            case "textmagic":
              res = await sdk.messaging.updateTextmagicProvider(
                provider.$id,
                values.name, // name
              );
              break;
            case "vonage":
              res = await sdk.messaging.updateVonageProvider(
                provider.$id,
                values.name, // name
              );
              break;
            default:
              throw new Error(`Unsupported SMS provider: ${provider.provider}`);
          }
          break;
        case "push":
          switch (provider.provider) {
            case "fcm":
              res = await sdk.messaging.updateFcmProvider(
                provider.$id,
                values.name, // name
              );
              break;
            case "apns":
              res = await sdk.messaging.updateApnsProvider(
                provider.$id,
                values.name, // name
              );
              break;
            default:
              throw new Error(`Unsupported push provider: ${provider.provider}`);
          }
          break;
        default:
          throw new Error(`Unsupported provider type: ${provider.type}`);
      }

      addToast({
        variant: "success",
        message: "Provider updated successfully",
      });
      await refresh();
    } catch (e: any) {
      addToast({
        variant: "danger",
        message: e.message,
      });
    }
  }

  return (
    <>
      <Form
        initialValues={{
          name: provider.name,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={onSubmit}
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
