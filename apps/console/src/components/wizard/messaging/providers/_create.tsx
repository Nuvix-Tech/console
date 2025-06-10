"use client";
import React from "react";
import { Box, CloseButton, Dialog, Flex, Portal, Text } from "@chakra-ui/react";
import { Form, SubmitButton } from "../../../others/forms";
import { Button, Column, useConfirm, useToast } from "@nuvix/ui/components";
import { MessagingProviderType, Models } from "@nuvix/console";
import { CreateProviderTypeEmail } from "./_type_email";
import { CreateProviderTypeSms } from "./_type_sms";
import { CreateProviderTypePush } from "./_type_push";
import { getProviderSchema } from "./_schemas";
import {
  ProviderFormData,
  EmailProviderFormData,
  SmsProviderFormData,
  PushProviderFormData,
  getInitialValues,
  isEmailProviderFormData,
  isSmsProviderFormData,
  isPushProviderFormData,
} from "./_types";
import { useProjectStore } from "@/lib/store";
import { useFormikContext } from "formik";
import { getQueryClient } from "@/data/query-client";

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

  const getProviderTypeLabel = (providerType: MessagingProviderType) => {
    switch (providerType) {
      case MessagingProviderType.Email:
        return "Email Provider";
      case MessagingProviderType.Sms:
        return "SMS Provider";
      case MessagingProviderType.Push:
        return "Push Provider";
      default:
        return "Provider";
    }
  };

  async function onSubmit(values: ProviderFormData, resetForm: () => void) {
    if (!type) return;

    const client = getQueryClient();
    try {
      let res: any; // TODO: Replace with proper Provider model when available

      switch (type) {
        case MessagingProviderType.Email:
          if (isEmailProviderFormData(values)) {
            // TODO: Replace with actual SDK call when provider creation API is available
            // res = await sdk.messaging.createEmailProvider(
            //   values.providerId ?? "unique()",
            //   values.name,
            //   values.providerType,
            //   values.enabled,
            //   // ... other provider-specific fields
            // );
            console.log("Creating Email Provider:", values);
          }
          break;
        case MessagingProviderType.Sms:
          if (isSmsProviderFormData(values)) {
            // TODO: Replace with actual SDK call when provider creation API is available
            // res = await sdk.messaging.createSmsProvider(
            //   values.providerId ?? "unique()",
            //   values.name,
            //   values.providerType,
            //   values.enabled,
            //   // ... other provider-specific fields
            // );
            console.log("Creating SMS Provider:", values);
          }
          break;
        case MessagingProviderType.Push:
          if (isPushProviderFormData(values)) {
            // TODO: Replace with actual SDK call when provider creation API is available
            // res = await sdk.messaging.createPushProvider(
            //   values.providerId ?? "unique()",
            //   values.name,
            //   values.providerType,
            //   values.enabled,
            //   // ... other provider-specific fields
            // );
            console.log("Creating Push Provider:", values);
          }
          break;
        default:
          throw new Error(`Unsupported provider type: ${type}`);
      }

      const providerTypeLabel = getProviderTypeLabel(type);
      await refetch();
      addToast({
        variant: "success",
        message: `${providerTypeLabel} created successfully.`,
      });

      resetForm();
      await client.invalidateQueries({ queryKey: ["providers"] });
      onOpenChange?.({ open: false });
    } catch (error: any) {
      const providerTypeLabel = getProviderTypeLabel(type);
      addToast({
        variant: "danger",
        message: error.message || `Failed to create ${providerTypeLabel.toLowerCase()}`,
      });
    }
  }

  function handleClose({ open = false }: { open?: boolean }) {
    // confirm({
    //   title: "Exit process",
    //   description:
    //     "Are you sure you want to exit from this process? All data will be deleted. This action is irreversible.",
    //   confirm: {
    //     text: "Exit",
    //   },
    // }).then((v) => v && onOpenChange?.({ open }));
    onOpenChange?.({ open });
  }

  const providerConfig = (() => {
    if (!type) return null;

    try {
      const initialValues = getInitialValues(type);
      const schema = getProviderSchema(initialValues.providerType);

      switch (type) {
        case MessagingProviderType.Email:
          return {
            schema,
            component: CreateProviderTypeEmail,
            initialValues,
          };
        case MessagingProviderType.Sms:
          return {
            schema,
            component: CreateProviderTypeSms,
            initialValues,
          };
        case MessagingProviderType.Push:
          return {
            schema,
            component: CreateProviderTypePush,
            initialValues,
          };
        default:
          return null;
      }
    } catch (error) {
      console.error(`Failed to initialize ${getProviderTypeLabel(type)} configuration:`, error);
      return null;
    }
  })();

  if (!providerConfig || !type) {
    return null;
  }

  const { schema, component: ProviderComponent, initialValues } = providerConfig;
  const providerTypeLabel = getProviderTypeLabel(type);

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
                await onSubmit(values as ProviderFormData, resetForm);
              }}
            >
              <Dialog.Body h="full" gap={10} p={12} display="flex">
                <Box flex="1" h="full" maxWidth={{ base: "2xl" }} mx={"auto"}>
                  <Text fontSize="2xl" fontWeight="semibold" mb={6}>
                    Create {providerTypeLabel}
                  </Text>
                  <Column gap="8">
                    <ProviderComponent />
                  </Column>
                  <Flex justify="flex-end" mt={6} gap="4">
                    <Button variant="tertiary" onClick={() => handleClose({ open: false })}>
                      Cancel
                    </Button>
                    <SubmitButton>Create {providerTypeLabel}</SubmitButton>
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
