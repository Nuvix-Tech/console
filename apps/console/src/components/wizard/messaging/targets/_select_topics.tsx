import { Button } from "@nuvix/sui/components";
import { Card, IconButton, Text } from "@nuvix/ui/components";
import React, { useState, useMemo, useEffect } from "react";
import { Topics } from "./_topics";
import { LuPlus, LuX } from "react-icons/lu";
import { useProjectStore } from "@/lib/store";
import { DialogRoot } from "@/components/cui/dialog";
import { Models, MessagingProviderType, Query } from "@nuvix/console";
import { ProjectSdk } from "@/lib/sdk";

export const TopicsSelector = ({
  type,
  values,
  onSave,
}: { type: MessagingProviderType; values: string[]; onSave: (values: string[]) => void }) => {
  const { sdk } = useProjectStore((state) => state);
  const [topicsById, setTopicsById] = useState<Record<string, Models.Topic>>({});

  const hasTopics = useMemo(() => Object.keys(topicsById).length > 0, [topicsById]);

  // Fetch topics by IDs and set initial topicsById value
  useEffect(() => {
    const fetchTopics = async () => {
      if (values.length === 0) return;
      try {
        const topicsRecord: Record<string, Models.Topic> = {};
        const topic = await sdk.messaging.listTopics([Query.equal("$id", values)]);
        if (!topic.total) return;
        for (const _topic of topic.topics) {
          topicsRecord[_topic.$id] = _topic;
        }
        setTopicsById(topicsRecord);
      } catch (error) {
        // TODO: Handle error appropriately
      }
    };

    fetchTopics();
  }, [values, sdk]);

  const addTopics = (newTopics: Record<string, Models.Topic>) => {
    setTopicsById(newTopics);
    const newValues = Object.keys(newTopics);
    if (newValues.length > 0) {
      onSave(newValues);
    }
  };

  const removeTopic = (targetId: string) => {
    const newTopicsById = { ...topicsById };
    delete newTopicsById[targetId];
    setTopicsById(newTopicsById);
    const newValues = Object.keys(newTopicsById);
    if (newValues.length > 0) {
      onSave(newValues);
    }
  };

  if (!hasTopics) {
    return (
      <Card
        title="Topics & Topics"
        minHeight="160"
        radius="l-4"
        center
        fillWidth
        direction="column"
        gap="12"
      >
        <WithDialog
          type={type}
          onAddTopics={addTopics}
          sdk={sdk}
          groups={topicsById}
          trigger={IconButton}
          args={{
            children: <LuPlus />,
            type: "button",
          }}
        />
        <Text variant="body-default-s" onBackground="neutral-medium">
          Select topics to get started
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
              <th className="text-left p-3">Topics</th>
              <th className="w-10 pr-2">
                <WithDialog
                  type={type}
                  onAddTopics={addTopics}
                  sdk={sdk}
                  groups={topicsById}
                  trigger={Button}
                  args={{
                    children: (
                      <>
                        <LuPlus /> Add
                      </>
                    ),
                    type: "button",
                    size: "sm",
                  }}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(topicsById).map(([targetId, target]) => (
              <tr key={targetId} className="border-b">
                <td className="p-3">{target.name}</td>
                <td className="p-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeTopic(targetId)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <LuX size={18} />
                    </button>
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

export const WithDialog = ({
  type,
  onAddTopics,
  sdk,
  groups,
  trigger: Trigger,
  args,
}: DialogBoxProps) => {
  const [open, setOpen] = useState(false);

  const handleRoleClick = () => {
    setOpen(true);
  };

  return (
    <div className="relative">
      <Trigger variant="secondary" onClick={handleRoleClick} size="m" {...args} />

      <DialogRoot
        open={open}
        onOpenChange={({ open }) => setOpen(open)}
        closeOnEscape={false}
        closeOnInteractOutside={false}
      >
        <Topics
          add={(topics) => onAddTopics({ [topics.$id]: topics })}
          sdk={sdk}
          onClose={() => setOpen(false)}
          groups={groups}
          type={type}
        />
      </DialogRoot>
    </div>
  );
};

export type DialogBoxProps = {
  type: MessagingProviderType;
  onAddTopics: (topics: Record<string, Models.Topic>) => void;
  children?: React.ReactNode;
  groups: Record<string, Models.Topic>;
  sdk: ProjectSdk;
  trigger: React.ElementType;
  args?: any;
};
