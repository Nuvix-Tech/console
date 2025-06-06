import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { formatDate } from "@/lib/utils";
import React from "react";
import { useMessageStore } from "./store";
import { MessageTypeIcon } from "../../components";
import { MessagingProviderType } from "@nuvix/console";
import { Status } from "@/components/cui/status";
import { LogsDialog } from "@/components/others/ui";
import { Button } from "@nuvix/ui/components";

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

const DraftActions = () => {
  const { message } = useMessageStore((s) => s);
  if (!message) return;

  return (
    <>
      <div className="flex items-center gap-4">
        <Button size="s" variant="tertiary">
          Schedule
        </Button>
        <Button size="s" variant="secondary">
          Send Message
        </Button>
      </div>
    </>
  );
};
