import { useProjectStore } from "@/lib/store";
import { useMessageStore } from "./store";
import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import {
  TopicsSelectorList,
  WithDialog,
} from "@/components/wizard/messaging/targets/_select_topics";
import { XIcon } from "lucide-react";
import { Card, Text } from "@nuvix/ui/components";
import { MessagingProviderType, Models } from "@nuvix/console";
import { Form } from "@/components/others/forms";
import SubmitButton from "@/components/others/forms/button";
import { useEffect } from "react";
import { useFormikContext } from "formik";

export const UpdateTopics = () => {
  const { topicsById, setTopicsById, message } = useMessageStore((s) => s);
  const { sdk } = useProjectStore((s) => s);

  if (!message) return null;

  const type = message.providerType as MessagingProviderType;
  const isDraft = message.status === "draft";

  return (
    <Form
      initialValues={{
        topics: message.topics,
      }}
      onSubmit={async (values) => {}}
    >
      <CardBox actions={<SubmitButton>Update</SubmitButton>}>
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
