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

  const desc2 = (() => {
    if (message.status === "sent") {
      return `Sent At: ${formatDate(message.deliveredAt)}`;
    } else {
      return message.scheduledAt ? `Scheduled At: ${formatDate(message.scheduledAt)}` : "";
    }
  })();

  return (
    <>
      <CardBox
        className="relative"
        actions={
          message.status === "failed" ? (
            <LogsDialog
              title="Message Error"
              message={{
                title: "Message failed",
                code: message.deliveryErrors || [],
                desciption:
                  "The message has been processed with errors. Please refer to the logs below for more information.",
              }}
            >
              <Button variant="secondary" size="s">
                View logs
              </Button>
            </LogsDialog>
          ) : undefined
        }
      >
        <CardBoxBody>
          <CardBoxItem gap={"4"}>
            <CardBoxTitle className="flex gap-2 items-center">
              <MessageTypeIcon type={message.providerType as MessagingProviderType} />
            </CardBoxTitle>
          </CardBoxItem>
          <CardBoxItem>
            <CardBoxDesc>Created: {formatDate(message.$createdAt)}</CardBoxDesc>
            <CardBoxDesc>{desc2}</CardBoxDesc>
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
