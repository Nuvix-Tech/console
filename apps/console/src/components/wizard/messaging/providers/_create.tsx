"use client";
import React from "react";
import { Box, CloseButton, Dialog, Flex, Portal, Text } from "@chakra-ui/react";
import { Form, SubmitButton } from "../../../others/forms";
import { Button, Column, useToast } from "@nuvix/ui/components";
import { MessagingProviderType, Models, SmtpEncryption } from "@nuvix/console";
import { CreateProviderTypeEmail } from "./_type_email";
import { CreateProviderTypeSms } from "./_type_sms";
import { CreateProviderTypePush } from "./_type_push";
import { getProviderSchema } from "./_schemas";
import {
  ProviderFormData,
  getInitialValues,
  isEmailProviderFormData,
  isSmsProviderFormData,
  isPushProviderFormData,
} from "./_types";
import { useProjectStore } from "@/lib/store";
import { getQueryClient } from "@/data/query-client";
import { useParams, useRouter } from "next/navigation";

type CreateProviderProps = {
  children?: React.ReactNode;
  type: MessagingProviderType | null;
} & Omit<React.ComponentProps<typeof Dialog.Root>, "size" | "motionPreset" | "children">;

export const CreateProvider: React.FC<CreateProviderProps> = ({
  children,
  type,
  onOpenChange,
  ...props
}) => {
  const { addToast } = useToast();
  const { sdk } = useProjectStore((state) => state);
  const router = useRouter();
  const { id: projectId } = useParams<{ id: string }>();

  const path = `/project/${projectId}/messaging/providers`;

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
      let res: Models.Provider = {} as Models.Provider;
      const providerId = values.providerId ? values.providerId : "unique()";
      switch (type) {
        case MessagingProviderType.Email:
          if (isEmailProviderFormData(values)) {
            switch (values.providerType) {
              case "mailgun":
                res = await sdk.messaging.createMailgunProvider(
                  providerId,
                  values.name,
                  values.apiKey,
                  values.domain,
                  values.euRegion,
                  values.fromName,
                  values.fromEmail,
                  values.replyToName,
                  values.replyToEmail,
                  values.enabled,
                );
                break;
              case "sendgrid":
                res = await sdk.messaging.createSendgridProvider(
                  providerId,
                  values.name,
                  values.apiKey,
                  values.fromName,
                  values.fromEmail,
                  values.replyToName,
                  values.replyToEmail,
                  values.enabled,
                );
                break;
              case "smtp":
                res = await sdk.messaging.createSmtpProvider(
                  providerId,
                  values.name,
                  values.smtpHost!,
                  values.smtpPort,
                  values.smtpUsername,
                  values.smtpPassword,
                  values.smtpEncryption as SmtpEncryption,
                  values.autoTLS,
                  values.xMailer,
                  values.fromName,
                  values.fromEmail,
                  values.replyToName,
                  values.replyToEmail,
                  values.enabled,
                );
                break;
              default:
                throw new Error(`Unsupported email provider type: ${values["providerType"]}`);
            }
          }
          break;
        case MessagingProviderType.Sms:
          if (isSmsProviderFormData(values)) {
            switch (values.providerType) {
              case "twilio":
                res = await sdk.messaging.createTwilioProvider(
                  providerId,
                  values.name,
                  values.from,
                  values.accountSid,
                  values.authToken,
                  values.enabled,
                );
                break;
              case "msg91":
                res = await sdk.messaging.createMsg91Provider(
                  providerId,
                  values.name,
                  values.msg91TemplateId,
                  values.msg91SenderId,
                  values.msg91AuthKey,
                  values.enabled,
                );
                break;
              case "telesign":
                res = await sdk.messaging.createTelesignProvider(
                  providerId,
                  values.name,
                  values.telesignFrom,
                  values.telesignCustomerId,
                  values.telesignApiKey,
                  values.enabled,
                );
                break;
              case "textmagic":
                res = await sdk.messaging.createTextmagicProvider(
                  providerId,
                  values.name,
                  values.textmagicFrom,
                  values.textmagicUsername,
                  values.textmagicApiKey,
                  values.enabled,
                );
                break;
              case "vonage":
                res = await sdk.messaging.createVonageProvider(
                  providerId,
                  values.name,
                  values.vonageFrom,
                  values.vonageApiKey,
                  values.vonageApiSecret,
                  values.enabled,
                );
                break;
              default:
                throw new Error(`Unsupported SMS provider type: ${values["providerType"]}`);
            }
          }
          break;
        case MessagingProviderType.Push:
          if (isPushProviderFormData(values)) {
            switch (values.providerType) {
              case "fcm":
                res = await sdk.messaging.createFcmProvider(
                  providerId,
                  values.name,
                  values.serviceAccountJSON,
                  values.enabled,
                );
                break;
              case "apns":
                res = await sdk.messaging.createApnsProvider(
                  providerId,
                  values.name,
                  values.apnsKey,
                  values.apnsKeyId,
                  values.apnsTeamId,
                  values.apnsBundleId,
                  !values.apnsProduction,
                  values.enabled,
                );
                break;
              default:
                throw new Error(`Unsupported push provider type: ${values["providerType"]}`);
            }
          }
          break;
        default:
          throw new Error(`Unsupported provider type: ${type}`);
      }

      const providerTypeLabel = getProviderTypeLabel(type);
      addToast({
        variant: "success",
        message: `${providerTypeLabel} created successfully.`,
      });

      resetForm();
      await client.invalidateQueries({ queryKey: ["providers"] });
      router.push(`${path}/${res.$id}`);
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
