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

export const TopMeta: React.FC = () => {
  const { message } = useMessageStore((s) => s);
  if (!message) return;

  return (
    <>
      <CardBox>
        <CardBoxBody>
          <CardBoxItem gap={"4"}>
            <CardBoxTitle>
              <MessageTypeIcon type={message.providerType as any} />
              {message.providerType}
            </CardBoxTitle>
          </CardBoxItem>
          <CardBoxItem>
            <CardBoxDesc>Created: {formatDate(message.$createdAt)}</CardBoxDesc>
            <CardBoxDesc>Sent at: {formatDate(message.deliveredAt)}</CardBoxDesc>
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </>
  );
};
