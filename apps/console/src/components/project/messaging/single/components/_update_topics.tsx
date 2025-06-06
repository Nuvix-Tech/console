import { useProjectStore } from "@/lib/store";
import { useMessageStore } from "./store";
import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import {
  TopicsSelectorList,
  WithDialog,
} from "@/components/wizard/messaging/targets/_select_topics";
import { XIcon } from "lucide-react";
import { Card, Text, useToast } from "@nuvix/ui/components";
import { MessagingProviderType, Models } from "@nuvix/console";
import { Form } from "@/components/others/forms";
import SubmitButton from "@/components/others/forms/button";
import { useEffect } from "react";
import { useFormikContext } from "formik";

export const UpdateTopics = () => {
  const { message, refresh } = useMessageStore((s) => s);
  const { sdk } = useProjectStore((s) => s);
  const { addToast } = useToast();

  if (!message) return null;

  const type = message.providerType as MessagingProviderType;
  const isDraft = message.status === "draft";

  return (
    <Form
      initialValues={{
        topics: message.topics,
      }}
      enableReinitialize
      onSubmit={async (values) => {
        if (!isDraft) return;
        try {
          switch (type) {
            case MessagingProviderType.Email:
              await sdk.messaging.updateEmail(message.$id, values.topics);
              break;
            case MessagingProviderType.Push:
              await sdk.messaging.updatePush(message.$id, values.topics);
              break;
            case MessagingProviderType.Sms:
              await sdk.messaging.updateSms(message.$id, values.topics);
              break;
          }
          await refresh();
          addToast({
            variant: "success",
            message: "Message targets updated.",
          });
        } catch (e: any) {
          addToast({
            variant: "danger",
            message: e.message,
          });
        }
      }}
    >
      <CardBox actions={isDraft ? <SubmitButton>Update</SubmitButton> : undefined}>
        <CardBoxBody>
          <CardBoxItem gap={"4"}>
            <CardBoxTitle className="flex gap-2 items-center">Topics</CardBoxTitle>
          </CardBoxItem>
          <Updater />
        </CardBoxBody>
      </CardBox>
    </Form>
  );
};

const Updater = () => {
  const { topicsById, setTopicsById, message } = useMessageStore((s) => s);
  const { sdk } = useProjectStore((s) => s);
  if (!message) return;

  const { setFieldValue } = useFormikContext<{ topics: Models.Topic }>();

  const type = message.providerType as MessagingProviderType;
  const isDraft = message.status === "draft";
  const hasTopics = Object.keys(topicsById).length > 0;

  const removeTopic = (topicId: string) => {
    const updatedTopics = { ...topicsById };
    delete updatedTopics[topicId];
    setTopicsById(updatedTopics);
  };

  useEffect(() => {
    const values = Object.keys(topicsById);
    setFieldValue("topics", values);
  }, [topicsById]);

  return (
    <>
      <CardBoxItem>
        {hasTopics ? (
          <TopicsSelectorList
            sdk={sdk}
            type={type}
            topics={topicsById}
            addTopics={setTopicsById}
            removeTopic={removeTopic}
            canAdd={isDraft}
          />
        ) : (
          <Card
            title="Topics"
            minHeight="160"
            radius="l-4"
            center
            fillWidth
            direction="column"
            gap="12"
          >
            {isDraft ? (
              <>
                <WithDialog type={type} onAddTopics={setTopicsById} sdk={sdk} topics={topicsById} />
                <Text variant="body-default-s" onBackground="neutral-medium">
                  Choose topics to target your messages
                </Text>
              </>
            ) : (
              <Text variant="body-default-s" onBackground="neutral-medium">
                No topics added
              </Text>
            )}
          </Card>
        )}
      </CardBoxItem>
    </>
  );
};
