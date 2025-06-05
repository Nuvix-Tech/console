import { CardBox, CardBoxBody, CardBoxItem } from "@/components/others/card";
import { useMessageStore } from "./store";
import { MessagingProviderType } from "@nuvix/console";
import { useToast } from "@nuvix/ui/components";
import { Form } from "@/components/others/forms";
import { MessagePreview } from "@/components/wizard/messaging";
import React from "react";
import { emailSchema, pushSchema, smsSchema } from "./update-message/_schemas";
import { UpdateMessageTypeMail } from "./update-message/_type_mail";
import { UpdateMessageTypeSms } from "./update-message/_type_sms";
import { UpdateMessageTypePush } from "./update-message/_type_push";

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
  const { message } = useMessageStore((s) => s);
  const { addToast } = useToast();

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
    try {
      // TODO: Implement message update logic
      console.log("Updating message with values:", values);
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
      <CardBox className="relative">
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
