import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, SubmitButton } from "@/components/others/forms";
import { useProjectStore } from "@/lib/store";
import { useToast } from "@nuvix/ui/components";
import React from "react";
import * as y from "yup";
import { useProvider } from "./store";
import { MessagingProviderType } from "@nuvix/console";
import { transformDataToSchema, transformSchemaToData } from "./_update_schemas";
import { getProviderSchema } from "@/components/wizard/messaging/providers/_schemas";
import { renderSmsProviderFields } from "@/components/wizard/messaging/providers/_type_sms";
import { renderEmailProviderFields } from "@/components/wizard/messaging/providers/_type_email";
import { renderPushProviderFields } from "@/components/wizard/messaging/providers/_type_push";

export const UpdateSettings: React.FC = () => {
  const sdk = useProjectStore.use.sdk?.();
  const { provider, refresh } = useProvider((s) => s);
  const { addToast } = useToast();

  if (!provider || !sdk) return;
  const type = provider.type as MessagingProviderType;
  const providerType = provider.provider;

  const providerConfig = (() => {
    if (!type) return null;

    try {
      const initialValues = transformDataToSchema(
        { ...provider.credentials, ...provider.options },
        providerType,
      );
      const schema = getProviderSchema(providerType, y.object());

      switch (type) {
        case MessagingProviderType.Email:
          return {
            schema,
            component: renderEmailProviderFields,
            initialValues,
          };
        case MessagingProviderType.Sms:
          return {
            schema,
            component: renderSmsProviderFields,
            initialValues,
          };
        case MessagingProviderType.Push:
          return {
            schema,
            component: renderPushProviderFields,
            initialValues,
          };
        default:
          return null;
      }
    } catch (error) {
      console.error(`Failed to initialize ${provider.name} configuration:`, error);
      return null;
    }
  })();

  if (!providerConfig || !type) {
    return null;
  }

  async function onSubmit(values: any) {
    if (!provider || !sdk) return;
    values = transformSchemaToData(values, providerType);
    try {
      let res: any = {} as any;
      switch (provider.type) {
        case MessagingProviderType.Email:
          switch (provider.provider) {
            case "mailgun":
              res = await sdk.messaging.updateMailgunProvider(
                provider.$id,
                provider.name, // name
                values.apiKey, // apiKey
                values.domain, // domain
                values.isEuRegion, // isEuRegion
                provider.enabled, // enabled
                values.fromName, // fromName
                values.fromEmail, // fromEmail
                values.replyToName, // replyToName
                values.replyToEmail, // replyToEmail
              );
              break;
            case "sendgrid":
              res = await sdk.messaging.updateSendgridProvider(
                provider.$id,
                provider.name, // name
                provider.enabled, // enabled
                values.apiKey, // apiKey
                values.fromName, // fromName
                values.fromEmail, // fromEmail
                values.replyToName, // replyToName
                values.replyToEmail, // replyToEmail
              );
              break;
            case "smtp":
              res = await sdk.messaging.updateSmtpProvider(
                provider.$id,
                provider.name, // name
                values.host, // host
                values.port, // port
                values.username, // username
                values.password, // password
                values.encryption, // encryption
                values.autoTLS, // autoTLS
                values.mailer, // mailer
                values.fromName, // fromName
                values.fromEmail, // fromEmail
                values.replyToName, // replyToName
                values.replyToEmail, // replyToEmail
                provider.enabled, // enabled
              );
              break;
            default:
              throw new Error(`Unsupported email provider: ${provider.provider}`);
          }
          break;
        case MessagingProviderType.Sms:
          switch (provider.provider) {
            case "twilio":
              res = await sdk.messaging.updateTwilioProvider(
                provider.$id,
                provider.name, // name
                provider.enabled, // enabled
                values.accountSid, // accountSid
                values.authToken, // authToken
                values.from, // from
              );
              break;
            case "msg91":
              res = await sdk.messaging.updateMsg91Provider(
                provider.$id,
                provider.name, // name
                provider.enabled, // enabled
                values.templateId, // templateId
                values.senderId, // senderId
                values.authKey, // authKey
              );
              break;
            case "telesign":
              res = await sdk.messaging.updateTelesignProvider(
                provider.$id,
                provider.name, // name
                provider.enabled, // enabled
                values.customerId, // customerId
                values.apiKey, // apiKey
                values.from, // from
              );
              break;
            case "textmagic":
              res = await sdk.messaging.updateTextmagicProvider(
                provider.$id,
                provider.name, // name
                provider.enabled, // enabled
                values.username, // username
                values.apiKey, // apiKey
                values.from, // from
              );
              break;
            case "vonage":
              res = await sdk.messaging.updateVonageProvider(
                provider.$id,
                provider.name, // name
                provider.enabled, // enabled
                values.apiKey, // apiKey
                values.apiSecret, // apiSecret
                values.from, // from
              );
              break;
            default:
              throw new Error(`Unsupported SMS provider: ${provider.provider}`);
          }
          break;
        case MessagingProviderType.Push:
          switch (provider.provider) {
            case "fcm":
              res = await sdk.messaging.updateFcmProvider(
                provider.$id,
                provider.name, // name
                provider.enabled, // enabled
                values.serviceAccountJSON, // serviceAccountJSON
              );
              break;
            case "apns":
              res = await sdk.messaging.updateApnsProvider(
                provider.$id,
                provider.name, // name
                provider.enabled, // enabled
                values.authKey, // authKey
                values.authKeyId, // authKeyId
                values.teamId, // teamId
                values.bundleId, // bundleId
                values.sandbox, // sandbox
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
        initialValues={providerConfig.initialValues}
        enableReinitialize
        validationSchema={providerConfig.schema}
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
              <CardBoxTitle>Settings</CardBoxTitle>
              <CardBoxDesc></CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem className="space-y-4">
              {providerConfig.component(providerType)}
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
