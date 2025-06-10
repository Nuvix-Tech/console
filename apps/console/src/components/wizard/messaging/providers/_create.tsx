"use client";
import React from "react";
import { Box, CloseButton, Dialog, Flex, Portal, Text } from "@chakra-ui/react";
import { Form, SubmitButton } from "../../../others/forms";
import { Button, Column, useConfirm, useToast } from "@nuvix/ui/components";
import { MessagingProviderType, Models } from "@nuvix/console";

import { useProjectStore } from "@/lib/store";
import { useFormikContext } from "formik";
import { getQueryClient } from "@/data/query-client";
import { MobileMail } from "@/components/project/messaging/components/_screen_mail";
import { MobileSMS } from "@/components/project/messaging/components/_screen_sms";
import { MobileNotification } from "@/components/project/messaging/components/_screen_push";

type CreateProviderProps = {
  children?: React.ReactNode;
  type: MessagingProviderType | null;
  refetch: () => Promise<void>;
} & Omit<React.ComponentProps<typeof Dialog.Root>, "size" | "motionPreset" | "children">;

export const CreateProvider: React.FC<CreateProviderProps> = ({
  children,
  type,
  refetch,
  onOpenChange,
  ...props
}) => {
  const { addToast } = useToast();
  const { sdk } = useProjectStore((state) => state);
  const confirm = useConfirm();

  const getMessageTypeLabel = (messageType: MessagingProviderType) => {
    switch (messageType) {
      case MessagingProviderType.Email:
        return "Email";
      case MessagingProviderType.Sms:
        return "SMS";
      case MessagingProviderType.Push:
        return "Push Notification";
      default:
        return "Message";
    }
  };

  async function onSubmit(values: MessageFormData, resetForm: () => void) {
    if (!type) return;

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
        default:
          throw new Error(`Unsupported message type: ${type}`);
      }

      const actionText = draft ? "saved as draft" : "created";
      const messageTypeLabel = getMessageTypeLabel(type);
      await refetch();
      addToast({
        variant: "success",
        message: `${messageTypeLabel} ${actionText} successfully.`,
      });

      resetForm();
      await client.invalidateQueries({ queryKey: ["messages"] });
      onOpenChange?.({ open: false });
    } catch (error: any) {
      const messageTypeLabel = getMessageTypeLabel(type);
      addToast({
        variant: "danger",
        message: error.message || `Failed to create ${messageTypeLabel.toLowerCase()}`,
      });
    }
  }

  function handleClose({ open = false }: { open?: boolean }) {
    confirm({
      title: "Exit process",
      description:
        "Are you sure you want to exit from this process? All data will be deleted. This action is irreversible.",
      confirm: {
        text: "Exit",
      },
    }).then((v) => v && onOpenChange?.({ open }));
  }

  const messageConfig = (() => {
    if (!type) return null;

    try {
      const initialValues = getInitialValues(type);

      switch (type) {
        case MessagingProviderType.Email:
          return {
            schema: emailSchema,
            component: CreateProviderTypeMail,
            initialValues,
          };
        case MessagingProviderType.Sms:
          return {
            schema: smsSchema,
            component: CreateProviderTypeSms,
            initialValues,
          };
        case MessagingProviderType.Push:
          return {
            schema: pushSchema,
            component: CreateProviderTypePush,
            initialValues,
          };
        default:
          return null;
      }
    } catch (error) {
      console.error(`Failed to initialize ${getMessageTypeLabel(type)} configuration:`, error);
      return null;
    }
  })();

  if (!messageConfig || !type) {
    return null;
  }

  const { schema, component: MessageComponent, initialValues } = messageConfig;
  const messageTypeLabel = getMessageTypeLabel(type);

  return (
    <Dialog.Root
      size="full"
      motionPreset="slide-in-right"
      onOpenChange={onOpenChange}
      onEscapeKeyDown={(e) => handleClose({ open: false })}
      {...props}
    >
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
                    Create {messageTypeLabel}
                  </Text>
                  <Column gap="8">
                    <MessageComponent />
                    <SelectTopicsTargets type={type} />
                    <Schedule />
                  </Column>
                  <Flex justify="flex-end" mt={6} gap="4">
                    <Button variant="tertiary" onClick={() => handleClose({ open: false })}>
                      Cancel
                    </Button>
                    <SubmitButton>Create {messageTypeLabel}</SubmitButton>
                  </Flex>
                </Box>

                <CloseButton
                  position="absolute"
                  top={4}
                  right={4}
                  onClick={() => handleClose({ open: false })}
                />
              </Dialog.Body>
            </Form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
