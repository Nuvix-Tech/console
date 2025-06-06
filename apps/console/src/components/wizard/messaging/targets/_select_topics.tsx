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
        <WithDialog type={type} onAddTopics={addTopics} sdk={sdk} groups={topicsById} />
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
                  showButton
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
                      <XIcon size={18} />
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

export const WithDialog = ({ type, onAddTopics, sdk, groups, showButton }: DialogBoxProps) => {
  const Trigger = showButton ? Button : IconButton;
  const [open, setOpen] = useState(false);

  const handleRoleClick = () => {
    setOpen(true);
  };

  const handleOnAdd = (topics: Models.Topic[]) => {
    const newData: Record<string, Models.Topic> = {};
    for (const topic of topics) {
      newData[topic.$id] = topic;
    }
    onAddTopics(newData);
  };

  return (
    <div className="relative">
      <Trigger
        variant="secondary"
        onClick={handleRoleClick}
        size="s"
        type="button"
        className="items-center"
      >
        <PlusIcon size={"14px"} /> {showButton && "Add"}
      </Trigger>

      <DialogRoot
        open={open}
        onOpenChange={({ open }) => setOpen(open)}
        closeOnEscape={false}
        closeOnInteractOutside={false}
      >
        <Topics
          add={handleOnAdd}
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
  showButton?: boolean;
};
