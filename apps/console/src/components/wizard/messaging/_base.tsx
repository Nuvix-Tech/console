"use client";
import React from "react";
import { Box, CloseButton, Dialog, Flex, Portal, Text } from "@chakra-ui/react";
import { Form, SubmitButton } from "../../others/forms";
import { Column, useToast } from "@nuvix/ui/components";
import { CreateMessageTypeMail, emailSchema } from "./_type_mail";
import { CreateMessageTypeSms, smsSchema } from "./_type_sms";
import { CreateMessageTypePush, pushSchema } from "./_type_push";
import { SelectTargets } from "./targets/_select_targets";

type CreateMessageProps = {
  children?: React.ReactNode;
  type: "push" | "sms" | "email" | null;
} & Omit<React.ComponentProps<typeof Dialog.Root>, "size" | "motionPreset" | "children">;

export const CreateMessage: React.FC<CreateMessageProps> = ({ children, type, ...props }) => {
  const { addToast } = useToast();

  async function onSubmit(values: any, resetForm: () => void) {
    try {
      // TODO: Implement message creation logic based on type
      console.log(`Creating ${type} message with values:`, values);

      // Placeholder success response
      addToast({
        variant: "success",
        message: `${type} message created successfully.`,
      });

      resetForm();
      // TODO: Navigate to appropriate page or close dialog
    } catch (error: any) {
      addToast({
        variant: "danger",
        message: error.message || "Failed to create message",
      });
    }
  }

  const messageConfig = (() => {
    switch (type) {
      case "email":
        return { schema: emailSchema, component: CreateMessageTypeMail };
      case "sms":
        return { schema: smsSchema, component: CreateMessageTypeSms };
      case "push":
        return { schema: pushSchema, component: CreateMessageTypePush };
      default:
        return null;
    }
  })();

  if (!messageConfig || !type) {
    return null;
  }

  const { schema, component: MessageComponent } = messageConfig;

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
                  initialValues={{}}
                  validationSchema={schema}
                  onSubmit={async (values, { resetForm }) => {
                    await onSubmit(values, resetForm);
                  }}
                >
                  <Column gap="8">
                    <MessageComponent />
                    <SelectTargets />
                  </Column>
                  <Flex justify="flex-end" mt={6}>
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
