import { useProjectStore } from "@/lib/store";
import { useMessageStore } from "./store";
import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { WithDialog } from "@/components/wizard/messaging/targets/_select_topics";
import { PlusIcon, XIcon } from "lucide-react";
import { Button, Card, IconButton, Text } from "@nuvix/ui/components";
import { MessagingProviderType } from "@nuvix/console";

export const UpdateTopics = () => {
  const { topicsById, setTopicsById, message } = useMessageStore((s) => s);
  const { sdk } = useProjectStore((s) => s);

  if (!message) return null;

  const type = message.providerType as MessagingProviderType;
  const isDraft = message.status === "draft";
  const hasTopics = Object.keys(topicsById).length > 0;

  const removeTopic = (topicId: string) => {
    const updatedTopics = { ...topicsById };
    delete updatedTopics[topicId];
    setTopicsById(updatedTopics);
  };

  return (
    <CardBox>
      <CardBoxBody>
        <CardBoxItem gap={"4"}>
          <CardBoxTitle className="flex gap-2 items-center">Topics</CardBoxTitle>
        </CardBoxItem>
        <CardBoxItem>
          {hasTopics ? (
            <div className="space-y-4">
              <div className="border rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Topics</th>
                      {isDraft && (
                        <th className="w-10 pr-2">
                          <WithDialog
                            type={type}
                            onAddTopics={() => {}}
                            sdk={sdk}
                            groups={topicsById}
                            trigger={Button}
                            args={{
                              children: (
                                <>
                                  <PlusIcon /> Add
                                </>
                              ),
                              type: "button",
                              size: "s",
                            }}
                          />
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(topicsById).map(([topicId, topic]) => (
                      <tr key={topicId} className="border-b">
                        <td className="p-3">{topic.name}</td>
                        {isDraft && (
                          <td className="p-3">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeTopic(topicId)}
                                className="text-gray-500 hover:text-red-500"
                              >
                                <XIcon size={18} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
                  <WithDialog
                    type={type}
                    onAddTopics={() => {}}
                    sdk={sdk}
                    groups={topicsById}
                    trigger={IconButton}
                    args={{
                      children: <PlusIcon />,
                      type: "button",
                    }}
                  />
                  <Text variant="body-default-s" onBackground="neutral-medium">
                    No topics selected yet!
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
      </CardBoxBody>
    </CardBox>
  );
};
