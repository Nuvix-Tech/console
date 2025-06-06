import { Card, IconButton, Text, Button } from "@nuvix/ui/components";
import React, { useState, useMemo } from "react";
import { Topics } from "./_topics";
import { useProjectStore } from "@/lib/store";
import { DialogRoot } from "@/components/cui/dialog";
import { Models, MessagingProviderType } from "@nuvix/console";
import { ProjectSdk } from "@/lib/sdk";
import { PlusIcon, XIcon } from "lucide-react";

export const TopicsSelector = ({
  type,
  onSave,
}: { type: MessagingProviderType; onSave: (values: string[]) => void }) => {
  const { sdk } = useProjectStore((state) => state);
  const [topicsById, setTopicsById] = useState<Record<string, Models.Topic>>({});

  const hasTopics = useMemo(() => Object.keys(topicsById).length > 0, [topicsById]);

  const addTopics = (newTopics: Record<string, Models.Topic>) => {
    setTopicsById((prev) => ({ ...prev, ...newTopics }));
    const allTopicIds = Object.keys({ ...topicsById, ...newTopics });
    onSave(allTopicIds);
  };

  const removeTopic = (topicId: string) => {
    setTopicsById((prev) => {
      const { [topicId]: removed, ...rest } = prev;
      return rest;
    });

    const updatedTopicsById = { ...topicsById };
    delete updatedTopicsById[topicId];
    const remainingTopicIds = Object.keys(updatedTopicsById);
    onSave(remainingTopicIds);
  };

  if (!hasTopics) {
    return (
      <Card
        title="Message Topics"
        minHeight="160"
        radius="l-4"
        center
        fillWidth
        direction="column"
        gap="12"
      >
        <WithDialog type={type} onAddTopics={addTopics} sdk={sdk} topics={topicsById} />
        <Text variant="body-default-s" onBackground="neutral-medium">
          Choose topics to target your messages
        </Text>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Selected Topics</th>
              <th className="w-10 pr-2">
                <WithDialog
                  type={type}
                  onAddTopics={addTopics}
                  sdk={sdk}
                  topics={topicsById}
                  showButton
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(topicsById).map(([topicId, topic]) => (
              <tr key={topicId} className="border-b last:border-b-0">
                <td className="p-3">{topic.name}</td>
                <td className="p-3">
                  <div className="flex justify-end">
                    <IconButton
                      variant="ghost"
                      size="s"
                      onClick={() => removeTopic(topicId)}
                      aria-label={`Remove ${topic.name}`}
                    >
                      <XIcon size={16} />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const WithDialog = ({ type, onAddTopics, sdk, topics, showButton }: DialogBoxProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleAddTopics = (selectedTopics: Models.Topic[]) => {
    const topicsMap = selectedTopics.reduce(
      (acc, topic) => {
        acc[topic.$id] = topic;
        return acc;
      },
      {} as Record<string, Models.Topic>,
    );

    onAddTopics(topicsMap);
    setOpen(false);
  };

  const TriggerComponent = showButton ? Button : IconButton;
  const triggerProps = showButton
    ? { variant: "secondary" as const, children: [<PlusIcon key="icon" size={14} />, "Add Topics"] }
    : {
        variant: "tertiary" as const,
        "aria-label": "Add topics",
        children: <PlusIcon size={14} />,
      };

  return (
    <>
      <TriggerComponent {...triggerProps} onClick={handleOpenDialog} size="s" type="button" />

      <DialogRoot
        open={open}
        onOpenChange={({ open }) => setOpen(open)}
        closeOnEscape
        closeOnInteractOutside
      >
        <Topics
          add={handleAddTopics}
          sdk={sdk}
          onClose={() => setOpen(false)}
          groups={topics}
          type={type}
        />
      </DialogRoot>
    </>
  );
};

export type DialogBoxProps = {
  type: MessagingProviderType;
  onAddTopics: (topics: Record<string, Models.Topic>) => void;
  topics: Record<string, Models.Topic>;
  sdk: ProjectSdk;
  showButton?: boolean;
};
