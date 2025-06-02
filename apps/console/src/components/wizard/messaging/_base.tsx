"use client";
import React from "react";
import { Box, CloseButton, Dialog, Flex, Portal, Text } from "@chakra-ui/react";
import { Form, SubmitButton } from "../../others/forms";
import { sdkForConsole } from "@/lib/sdk";
import { ID } from "@nuvix/console";
import { useRouter } from "@bprogress/next";
import { useToast } from "@nuvix/ui/components";
import { useAppStore } from "@/lib/store";
import { CreateMessageTypeMail, emailSchema } from "./_type_mail";
import { CreateMessageTypeSms, smsSchema } from "./_type_sms";
import { CreateMessageTypePush, pushSchema } from "./_type_push";

type CreateMessageProps = {
  children?: React.ReactNode;
  type: "push" | "sms" | "email" | null;
} & Omit<React.ComponentProps<typeof Dialog.Root>, "size" | "motionPreset" | "children">;

export const CreateMessage: React.FC<CreateMessageProps> = ({ children, type, ...props }) => {
  const { projects } = sdkForConsole;
  const organization = useAppStore.use.organization?.();
  const { push } = useRouter();
  const { addToast } = useToast();

  async function onSubmit(name: string, resetForm: any, password: string, id?: string) {
    try {
      const project = await projects.create(
        id && id.length > 6 ? id : ID.unique(),
        name,
        organization!.$id,
        password as any,
        "fra" as any,
      );
      addToast({
        variant: "success",
        message: "Your project created.",
      });
      resetForm();
      push(`/project/${project.$id}`);
    } catch (e: any) {
      addToast({
        variant: "danger",
        message: e.message,
      });
    }
  }

  const current = (() => {
    switch (type) {
      case "email":
        return { schema: emailSchema, component: CreateMessageTypeMail };
      case "sms":
        return { schema: smsSchema, component: CreateMessageTypeSms };
      case "push":
        return { schema: pushSchema, component: CreateMessageTypePush };
    }
  })();

  const Comp = current?.component;

  return (
    <>
      <Dialog.Root size="full" motionPreset="slide-in-right" {...props}>
        {children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Body h="full" gap={10} p={12} display="flex">
                <Box flex="1" h="full">
                  <Text fontSize="2xl" fontWeight="semibold" mb={6}>
                    Create {type} Message
                  </Text>
                  <Form
                    initialValues={{}}
                    validationSchema={current?.schema}
                    onSubmit={async (values, { resetForm }) => {
                      const { id, name, password } = values as any;
                      await onSubmit(name, resetForm, password, id);
                    }}
                  >
                    {Comp && <Comp />}
                    <Flex justify="flex-end" mt={6}>
                      <SubmitButton>Create</SubmitButton>
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
    </>
  );
};
