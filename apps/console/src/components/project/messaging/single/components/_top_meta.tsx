import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { formatDate } from "@/lib/utils";
import React, { useState } from "react";
import { useMessageStore } from "./store";
import { MessageTypeIcon } from "../../components";
import { MessagingProviderType } from "@nuvix/console";
import { Status } from "@/components/cui/status";
import { LogsDialog } from "@/components/others/ui";
import { Button, Dialog, useConfirm, useToast } from "@nuvix/ui/components";
import { FormDialog, InputField, SubmitButton } from "@/components/others/forms";
import * as y from "yup";
import { useProjectStore } from "@/lib/store";

export const TopMeta: React.FC = () => {
  const { message } = useMessageStore((s) => s);
  if (!message) return;

  const deliveryInfo = (() => {
    if (message.status === "sent") {
      return `Delivered at: ${formatDate(message.deliveredAt)}`;
    } else if (message.scheduledAt) {
      return `Scheduled for: ${formatDate(message.scheduledAt)}`;
    }
    return "";
  })();

  return (
    <>
      <CardBox
        className="relative"
        actions={
          message.status === "failed" ? (
            <LogsDialog
              title="Message Error Details"
              message={{
                title: "Message Failed to Send",
                code: message.deliveryErrors || [],
                description:
                  "This message failed to deliver. Please review the error logs below for detailed information and troubleshooting steps.",
              }}
            >
              <Button variant="secondary" size="s">
                View Logs
              </Button>
            </LogsDialog>
          ) : (
            message.status === "draft" && <DraftActions />
          )
        }
      >
        <CardBoxBody>
          <CardBoxItem gap={"4"}>
            <CardBoxTitle className="flex gap-2 items-center">
              <MessageTypeIcon type={message.providerType as MessagingProviderType} />
            </CardBoxTitle>
          </CardBoxItem>
          <CardBoxItem>
            <CardBoxDesc>Created on: {formatDate(message.$createdAt)}</CardBoxDesc>
            {deliveryInfo && <CardBoxDesc>{deliveryInfo}</CardBoxDesc>}
            <div className="absolute top-4 right-4">
              <Status
                value={
                  message.status === "success"
                    ? "success"
                    : message.status === "failed"
                      ? "error"
                      : message.status === "processing"
                        ? "warning"
                        : "info"
                }
              >
                {message.status}
              </Status>
            </div>
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </>
  );
};

const schema = y.object().shape({
  date: y.string().required(),
  time: y.string().required(),
});

const DraftActions = () => {
  const [openSchedule, setOpenSchedule] = useState(false);
  const [sending, setSending] = useState(false);
  const { message, refresh } = useMessageStore((s) => s);
  const { sdk } = useProjectStore((s) => s);
  if (!message) return;

  const { addToast } = useToast();
  const confirm = useConfirm();
  const targetsCount = message.targets.length;

  const handleMessage = async () => {
    setSending(true);
    try {
      const canSend = await confirm({
        title: "Send message",
        description: `You are about to send a message to an estimated ${targetsCount} ${targetsCount <= 1 ? "target" : "targets"}. Would you like to proceed?`,
        confirm: {
          text: "Send",
          variant: "primary",
        },
      });
      if (canSend) {
        try {
          switch (type) {
            case MessagingProviderType.Email:
              await sdk.messaging.updateEmail(
                message.$id,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                false,
                undefined,
                undefined,
                undefined,
              );
              break;
            case MessagingProviderType.Push:
              await sdk.messaging.updatePush(
                message.$id,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                false,
              );
              break;
            case MessagingProviderType.Sms:
              await sdk.messaging.updateSms(
                message.$id,
                undefined,
                undefined,
                undefined,
                undefined,
                false,
              );
              break;
          }

          await refresh();
          addToast({
            variant: "success",
            message: "Message sent.",
          });
        } catch (e: any) {
          addToast({
            variant: "danger",
            message: e.message,
          });
        }
      }
    } finally {
      setSending(false);
    }
  };

  const type = message.providerType as MessagingProviderType;

  return (
    <>
      <div className="flex items-center gap-4">
        <Button size="s" variant="tertiary" onClick={() => setOpenSchedule(true)}>
          Schedule
        </Button>
        <Button size="s" variant="secondary" loading={sending} onClick={handleMessage}>
          Send Message
        </Button>
      </div>
      <FormDialog
        dialog={{
          isOpen: openSchedule,
          onClose: () => setOpenSchedule(false),
          title: "Schedule message",
          footer: <SubmitButton>Schedule</SubmitButton>,
        }}
        form={{
          initialValues: {
            time: "",
            date: "",
          },
          validationSchema: schema,
          onSubmit: async (values) => {
            const date = new Date(`${values.date}T${values.time}`).toISOString();
            try {
              switch (type) {
                case MessagingProviderType.Email:
                  await sdk.messaging.updateEmail(
                    message.$id,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    false,
                    undefined,
                    undefined,
                    undefined,
                    date,
                  );
                  break;
                case MessagingProviderType.Push:
                  await sdk.messaging.updatePush(
                    message.$id,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    false,
                    date,
                  );
                  break;
                case MessagingProviderType.Sms:
                  await sdk.messaging.updateSms(
                    message.$id,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    false,
                    date,
                  );
                  break;
              }

              await refresh();
              addToast({
                variant: "success",
                message: "Message Scheduled.",
              });
            } catch (e: any) {
              addToast({
                variant: "danger",
                message: e.message,
              });
            }
          },
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full items-start">
          <InputField type="date" name="date" label="Date" required />
          <InputField type="time" name="time" label="Time" min="00:00" step="0.001" required />
          <p className="text-sm text-secondary">The message will be sent later</p>
        </div>
      </FormDialog>
    </>
  );
};
