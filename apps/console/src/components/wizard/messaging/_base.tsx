"use client";
import React from "react";
import { Box, CloseButton, Dialog, Flex, Portal, Text } from "@chakra-ui/react";
import { Form, SubmitButton } from "../../others/forms";
import { Button, Column, useToast } from "@nuvix/ui/components";
import { CreateMessageTypeMail } from "./_type_mail";
import { CreateMessageTypeSms } from "./_type_sms";
import { CreateMessageTypePush } from "./_type_push";
import { MessagingProviderType, Models } from "@nuvix/console";
import { SelectTopicsTargets } from "./targets/_selector";
import { Schedule } from "./_schedule";
import { emailSchema, smsSchema, pushSchema } from "./_schemas";
import {
  MessageFormData,
  EmailFormData,
  SmsFormData,
  PushFormData,
  getInitialValues,
} from "./_types";
import { useProjectStore } from "@/lib/store";
import { useFormikContext } from "formik";
import { getQueryClient } from "@/data/query-client";
import { MobileMail } from "@/components/project/messaging/components/_screen_mail";
import { MobileSMS } from "@/components/project/messaging/components/_screen_sms";
import { MobileNotification } from "@/components/project/messaging/components/_screen_push";

type CreateMessageProps = {
  children?: React.ReactNode;
  type: MessagingProviderType | null;
} & Omit<React.ComponentProps<typeof Dialog.Root>, "size" | "motionPreset" | "children">;

export const CreateMessage: React.FC<CreateMessageProps> = ({ children, type, ...props }) => {
  const { addToast } = useToast();
  const { sdk } = useProjectStore((state) => state);

  async function onSubmit(values: MessageFormData, resetForm: () => void) {
    const client = getQueryClient();
    try {
      let res: Models.Message;
      const draft = values.draft ?? false;
      const scheduledAt =
        values.schedule === "schedule" ? new Date(`${values.date}T${values.time}`) : undefined;

      switch (type) {
        case MessagingProviderType.Email:
          const { id, subject, message, html, topics, targets } = values as EmailFormData;
          res = await sdk.messaging.createEmail(
            id ?? "unique()",
            subject,
            message,
            topics,
            undefined,
            targets,
            undefined,
            undefined,
            undefined,
            draft,
            html,
            scheduledAt?.toISOString(),
          );
          break;
        case MessagingProviderType.Sms:
          const {
            id: smsId,
            message: smsMessage,
            topics: smsTopics,
            targets: smsTargets,
          } = values as SmsFormData;
          res = await sdk.messaging.createSms(
            smsId ?? "unique()",
            smsMessage,
            smsTopics,
            undefined,
            smsTargets,
            draft,
            scheduledAt?.toISOString(),
          );
          break;
        case MessagingProviderType.Push:
          const pushValues = values as PushFormData;
          const {
            id: pushId,
            title,
            message: pushMessage,
            image,
            topics: pushTopics,
            targets: pushTargets,
            data,
          } = pushValues;
          res = await sdk.messaging.createPush(
            pushId ?? "unique()",
            title,
            pushMessage,
            pushTopics,
            undefined,
            pushTargets,
            data,
            undefined,
            image,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            draft,
            scheduledAt?.toISOString(),
          );
          break;
      }

      addToast({
        variant: "success",
        message: `${type} message created successfully.`,
      });

      resetForm();
      client.invalidateQueries({ queryKey: ["messages"] });
      props.onOpenChange?.({ open: false });
    } catch (error: any) {
      addToast({
        variant: "danger",
        message: error.message || "Failed to create message",
      });
    }
  }

  const messageConfig = (() => {
    if (!type) return null;

    try {
      const initialValues = getInitialValues(type);

      switch (type) {
        case MessagingProviderType.Email:
          return {
            schema: emailSchema,
            component: CreateMessageTypeMail,
            initialValues,
          };
        case MessagingProviderType.Sms:
          return {
            schema: smsSchema,
            component: CreateMessageTypeSms,
            initialValues,
          };
        case MessagingProviderType.Push:
          return {
            schema: pushSchema,
            component: CreateMessageTypePush,
            initialValues,
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

  const { schema, component: MessageComponent, initialValues } = messageConfig;

  return (
    <Dialog.Root size="full" motionPreset="slide-in-right" {...props}>
      {children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Form
              initialValues={initialValues}
              validationSchema={schema}
              onSubmit={async (values, { resetForm }) => {
                await onSubmit(values as MessageFormData, resetForm);
              }}
            >
              <Dialog.Body h="full" gap={10} p={12} display="flex">
                <Box flex="1" h="full" maxWidth={{ base: "2xl" }}>
                  <Text fontSize="2xl" fontWeight="semibold" mb={6}>
                    Create {type} Message
                  </Text>
                  <Column gap="8">
                    <MessageComponent />
                    <SelectTopicsTargets type={type} />
                    <Schedule />
                  </Column>
                  <Flex justify="flex-end" mt={6} gap={"4"}>
                    <Dialog.Trigger asChild>
                      <Button variant="tertiary">Cancel</Button>
                    </Dialog.Trigger>
                    <DraftButton />
                    <SubmitButton>Create Message</SubmitButton>
                  </Flex>
                </Box>
                <Box className="sticky mx-auto my-20">
                  <Preview type={type} />
                </Box>

                <Dialog.Trigger>
                  <CloseButton position="absolute" top={4} right={4} />
                </Dialog.Trigger>
              </Dialog.Body>
            </Form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

const DraftButton = () => {
  const { setFieldValue, submitForm, isSubmitting, values } = useFormikContext<any>();

  return (
    <Button
      onClick={() => {
        setFieldValue("draft", true);
        submitForm();
      }}
      type="button"
      disabled={isSubmitting}
      variant="secondary"
      loading={isSubmitting && values["draft"]}
    >
      Save draft
    </Button>
  );
};

export const Preview = ({ type }: { type: MessagingProviderType }) => {
  const { project } = useProjectStore((state) => state);
  const senderName = project.name;
  const appIcon = project.name.slice(0, 1);
  const { values } = useFormikContext<any>();

  const defaultMessage = "Enter text in left side message box to see here.";

  switch (type) {
    case MessagingProviderType.Email:
      return (
        <MobileMail
          email={{
            senderName,
            content: values["message"] || defaultMessage,
            subject: values["subject"] || "Subject",
            html: values["html"],
          }}
        />
      );
    case MessagingProviderType.Sms:
      return (
        <MobileSMS
          sms={{
            contactName: senderName,
            messages: [
              {
                id: "1",
                text: values["message"] || defaultMessage,
                isOutgoing: false,
                timestamp: "now",
              },
            ],
          }}
        />
      );
    case MessagingProviderType.Push:
      return (
        <MobileNotification
          notification={{
            appIcon,
            senderName,
            message: values["message"] || defaultMessage,
            title: values["title"] || "Message Title",
          }}
        />
      );
    default:
      return null;
  }
};
