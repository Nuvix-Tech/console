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
import { MessagingProviderType } from "@nuvix/console";

const schema = y.object({
  is: y.boolean().required(),
});

export const TopMeta: React.FC = () => {
  const sdk = useProjectStore.use.sdk?.();
  const { provider, refresh } = useProvider((s) => s);
  const { addToast } = useToast();

  if (!provider || !sdk) return;

  async function onSubmit(values: { is: boolean }) {
    if (!provider || !sdk) return;

    try {
      let res: any = {} as any;
      switch (provider.type) {
        case MessagingProviderType.Email:
          switch (provider.provider) {
            case "mailgun":
              res = await sdk.messaging.updateMailgunProvider(
                provider.$id,
                undefined, // name
                undefined, // apiKey
                undefined, // domain
                undefined, // euRegion
                values.is, // enabled
              );
              break;
            case "sendgrid":
              res = await sdk.messaging.updateSendgridProvider(
                provider.$id,
                undefined, // name
                values.is, // enabled
              );
              break;
            case "smtp":
              res = await sdk.messaging.updateSmtpProvider(
                provider.$id,
                undefined, // name
                undefined, // smtpHost
                undefined, // smtpPort
                undefined, // smtpUsername
                undefined, // smtpPassword
                undefined, // smtpEncryption
                undefined, // autoTLS
                undefined, // xMailer
                undefined, // fromName
                undefined, // fromEmail
                undefined, // replyToName
                undefined, // replyToEmail
                values.is, // enabled
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
                undefined, // name
                values.is, // enabled
              );
              break;
            case "msg91":
              res = await sdk.messaging.updateMsg91Provider(
                provider.$id,
                undefined, // name
                values.is, // enabled
              );
              break;
            case "telesign":
              res = await sdk.messaging.updateTelesignProvider(
                provider.$id,
                undefined, // name
                values.is, // enabled
              );
              break;
            case "textmagic":
              res = await sdk.messaging.updateTextmagicProvider(
                provider.$id,
                undefined, // name
                values.is, // enabled
              );
              break;
            case "vonage":
              res = await sdk.messaging.updateVonageProvider(
                provider.$id,
                undefined, // name
                values.is, // enabled
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
                undefined, // name
                values.is, // enabled
              );
              break;
            case "apns":
              res = await sdk.messaging.updateApnsProvider(
                provider.$id,
                undefined, // name
                values.is, // enabled
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
          is: provider.enabled,
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
