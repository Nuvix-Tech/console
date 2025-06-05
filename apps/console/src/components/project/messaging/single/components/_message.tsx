import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { formatDate } from "@/lib/utils";
import { useMessageStore } from "./store";
import { MessageTypeIcon } from "../../components";
import { MessagingProviderType } from "@nuvix/console";
import { Button, useToast } from "@nuvix/ui/components";
import { Form } from "@/components/others/forms";
import { MessagePreview } from "@/components/wizard/messaging";
import React from "react";
import { emailSchema, pushSchema, smsSchema } from "./update-message/_schemas";
import { UpdateMessageTypeMail } from "./update-message/_type_mail";
import { UpdateMessageTypeSms } from "./update-message/_type_sms";
import { UpdateMessageTypePush } from "./update-message/_type_push";

export const UpdateMessage: React.FC = () => {
  const { message } = useMessageStore((s) => s);
  if (!message) return;

  const type = message.providerType as MessagingProviderType;
  const { addToast } = useToast();

  const messageConfig = (() => {
    if (!type) return null;

    try {
      switch (type) {
        case MessagingProviderType.Email:
          return {
            schema: emailSchema,
            component: UpdateMessageTypeMail,
          };
        case MessagingProviderType.Sms:
          return {
            schema: smsSchema,
            component: UpdateMessageTypeSms,
          };
        case MessagingProviderType.Push:
          return {
            schema: pushSchema,
            component: UpdateMessageTypePush,
          };
        default:
          return null;
      }
    } catch (error) {
      console.error(`Failed to get config for message type ${type}:`, error);
      return null;
    }
  })();

  if (!messageConfig || !type) {
    return null;
  }

  const { schema, component: MessageComponent } = messageConfig;
  const data = message.data as Record<string, any>; // TODO: --- add correct types

  return (
    <>
      <Form
        initialValues={{
          ...message.data,
          message: data["content"] || data["body"],
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          // try {
          //     await sdk.storage.updateBucket(bucket.$id, values.name);
          //     addToast({
          //         variant: "success",
          //         message: "Bucket name updated.",
          //     });
          //     await refresh();
          // } catch (e: any) {
          //     addToast({
          //         variant: "danger",
          //         message: e.message,
          //     });
          // }
        }}
      >
        <CardBox className="relative">
          <CardBoxBody>
            <CardBoxItem gap={"4"}>
              <MessagePreview type={message.providerType as MessagingProviderType} />
            </CardBoxItem>
            <CardBoxItem>
              <MessageComponent disabled={message.status !== "draft"} />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
