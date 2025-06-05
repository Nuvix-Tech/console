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
import { Button, useToast } from "@nuvix/ui/components";
import * as y from "yup";
import { Form } from "@/components/others/forms";
import { MessagePreview } from "@/components/wizard/messaging";

const schema = y.object({
  name: y.string().min(0).max(256).required(),
});

export const UpdateMessage: React.FC = () => {
  const { message } = useMessageStore((s) => s);
  if (!message) return;

  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          ...message.data,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          // try {
          //     await sdk.storage.updateBucket(bucket.$id, values.name);
          //     addToast({
          //         variant: "success",
          //         message: "Bucket name updated.",
          //     });
          //     await refresh();
          // } catch (e: any) {
          //     addToast({
          //         variant: "danger",
          //         message: e.message,
          //     });
          // }
        }}
      >
        <CardBox className="relative">
          <CardBoxBody>
            <CardBoxItem gap={"4"}>
              <CardBoxTitle>Message</CardBoxTitle>
              <MessagePreview type={message.providerType as MessagingProviderType} />
            </CardBoxItem>
            <CardBoxItem></CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
