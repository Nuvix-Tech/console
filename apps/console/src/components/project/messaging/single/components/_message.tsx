import { CardBox, CardBoxBody, CardBoxItem } from "@/components/others/card";
import { useMessageStore } from "./store";
import { MessagingProviderType } from "@nuvix/console";
import { useToast } from "@nuvix/ui/components";
import { Form, SubmitButton } from "@/components/others/forms";
import { MessagePreview } from "@/components/wizard/messaging";
import React from "react";
import { emailSchema, pushSchema, smsSchema } from "./update-message/_schemas";
import { UpdateMessageTypeMail } from "./update-message/_type_mail";
import { UpdateMessageTypeSms } from "./update-message/_type_sms";
import { UpdateMessageTypePush } from "./update-message/_type_push";
import { useProjectStore } from "@/lib/store";

interface MessageData {
  content?: string;
  body?: string;
  [key: string]: any;
}

const getMessageConfig = (type: MessagingProviderType) => {
  const configs = {
    [MessagingProviderType.Email]: {
      schema: emailSchema,
      component: UpdateMessageTypeMail,
    },
    [MessagingProviderType.Sms]: {
      schema: smsSchema,
      component: UpdateMessageTypeSms,
    },
    [MessagingProviderType.Push]: {
      schema: pushSchema,
      component: UpdateMessageTypePush,
    },
  };

  return configs[type] || null;
};

export const UpdateMessage: React.FC = () => {
  const { message, refresh } = useMessageStore((s) => s);
  const { addToast } = useToast();
  const { sdk } = useProjectStore((s) => s);

  if (!message?.providerType) {
    return null;
  }

  const type = message.providerType as MessagingProviderType;
  const messageConfig = getMessageConfig(type);

  if (!messageConfig) {
    console.warn(`Unsupported message type: ${type}`);
    return null;
  }

  const { schema, component: MessageComponent } = messageConfig;
  const data = message.data as MessageData;
  const isEditable = message.status === "draft";

  const handleSubmit = async (values: any) => {
    if (!isEditable) return;
    try {
      switch (type) {
        case MessagingProviderType.Email:
          await sdk.messaging.updateEmail(
            message.$id,
            undefined,
            undefined,
            undefined,
            values["subject"],
            values["message"],
            undefined,
            values["html"],
          );
          break;
        case MessagingProviderType.Push:
          await sdk.messaging.updatePush(
            message.$id,
            undefined,
            undefined,
            undefined,
            values["title"],
            values["message"],
            values["data"],
            undefined,
            values["image"],
          );
          break;
        case MessagingProviderType.Sms:
          await sdk.messaging.updateSms(
            message.$id,
            undefined,
            undefined,
            undefined,
            values["message"],
          );
          break;
      }

      await refresh();
      addToast({
        variant: "success",
        message: "Message updated successfully.",
      });
    } catch (error: any) {
      addToast({
        variant: "danger",
        message: error.message || "Failed to update message.",
      });
    }
  };

  return (
    <Form
      initialValues={{
        ...message.data,
        message: data?.content || data?.body || "",
      }}
      enableReinitialize
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      <CardBox
        className="relative"
        actions={isEditable ? <SubmitButton>Update</SubmitButton> : undefined}
      >
        <CardBoxBody>
          <CardBoxItem gap="4">
            <MessagePreview type={type} />
          </CardBoxItem>
          <CardBoxItem>
            <MessageComponent disabled={!isEditable} />
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </Form>
  );
};
