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
            <Dialog.Body h="full" gap={10} p={12} display="flex">
              <Box flex="1" h="full" maxWidth={{ base: "2xl" }}>
                <Text fontSize="2xl" fontWeight="semibold" mb={6}>
                  Create {type} Message
                </Text>
                <Form
                  initialValues={initialValues}
                  validationSchema={schema}
                  onSubmit={async (values, { resetForm }) => {
                    await onSubmit(values as MessageFormData, resetForm);
                  }}
                >
                  <Column gap="8">
                    <MessageComponent />
                    <SelectTopicsTargets type={type} />
                    <Schedule />
                  </Column>
                  <Flex justify="flex-end" mt={6} gap={"4"}>
                    <Dialog.Trigger asChild>
                      <Button variant="tertiary">Cancle</Button>
                    </Dialog.Trigger>
                    <DraftButton />
                    <SubmitButton>Create Message</SubmitButton>
                  </Flex>
                </Form>
              </Box>

              <Dialog.Trigger>
                <CloseButton position="absolute" top={4} right={4} />
              </Dialog.Trigger>
            </Dialog.Body>
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
