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
  const [topicsById, setTopicsById] = useState<Map<string, Models.Topic>>(new Map());

  const hasTopics = useMemo(() => topicsById.size > 0, [topicsById]);

  // Fetch topics by IDs and set initial topicsById value
  useEffect(() => {
    const fetchTopics = async () => {
      if (values.length === 0) return;
      try {
        const topicsMap = new Map<string, Models.Topic>();
        const topic = await sdk.messaging.listTopics([Query.equal("$id", values)]);
        if (!topic.total) return;
        for (const _topic of topic.topics) {
          topicsMap.set(_topic.$id, _topic);
        }
        setTopicsById(topicsMap);
      } catch (error) {
        // TODO: Handle error appropriately
      }
    };

    fetchTopics();
  }, [values, sdk]);

  const addTopics = (newTopics: Map<string, Models.Topic>) => {
    setTopicsById(newTopics);
    const newValues = Array.from(newTopics.keys());
    if (newValues.length > 0) {
      onSave(newValues);
    }
  };

  const removeTopic = (targetId: string) => {
    const newTopicsById = new Map(topicsById);
    newTopicsById.delete(targetId);
    setTopicsById(newTopicsById);
    const newValues = Array.from(newTopicsById.keys());
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
                    size: "sm",
                  }}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from(topicsById.entries()).map(([targetId, target]) => (
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
          add={(topics) => onAddTopics(new Map([[topics.$id, topics]]))}
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
  onAddTopics: (topics: Map<string, Models.Topic>) => void;
  children?: React.ReactNode;
  groups: Map<string, Models.Topic>;
  sdk: ProjectSdk;
  trigger: React.ElementType;
  args?: any;
};
