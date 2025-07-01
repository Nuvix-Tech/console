import React, { useEffect } from "react";
import { MessagingProviderType, Models, Query } from "@nuvix/console";
import { Button, HStack, Text, Code } from "@chakra-ui/react";
import { SelectDialog, SimpleSelector, usePaginatedSelector } from "@/components/others";
import { ProjectSdk } from "@/lib/sdk";
import { DialogTrigger } from "@nuvix/cui/dialog";
import { Checkbox } from "@nuvix/cui/checkbox";
import { cn } from "@nuvix/sui/lib/utils";

export type TopicsProps = {
  add: (topics: Models.Topic[]) => void;
  onClose: VoidFunction;
  groups: Record<string, Models.Topic>;
  type: MessagingProviderType;
} & { sdk: ProjectSdk };

export const Topics = ({ add, sdk, onClose, groups, type }: TopicsProps) => {
  const fetchTopics = async (search: string | undefined, limit: number, offset: number) => {
    const queries = [];
    queries.push(Query.limit(limit), Query.offset(offset));
    const res = await sdk.messaging.listTopics(queries, search);
    return { data: res.topics, total: res.total };
  };

  const { selected, toggleSelected, setSelected, ...rest } = usePaginatedSelector<
    Models.Topic,
    Models.Topic
  >({
    fetchFunction: fetchTopics,
    limit: 10,
  });

  const onSave = () => {
    add(selected);
    onClose();
  };

  useEffect(() => {
    const values = Object.values(groups);
    if (values.length) setSelected(values);
  }, [groups]);

  const getTargetCount = (topic: Models.Topic): number => {
    switch (type) {
      case MessagingProviderType.Email:
        return topic.emailTotal || 0;
      case MessagingProviderType.Sms:
        return topic.smsTotal || 0;
      case MessagingProviderType.Push:
        return topic.pushTotal || 0;
      default:
        return 0;
    }
  };

  return (
    <SelectDialog
      title="Select Topics"
      description="Choose topics to add to your messaging configuration."
      actions={
        <>
          <DialogTrigger asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogTrigger>
          <Button disabled={selected.length === 0} onClick={onSave} type="button">
            Add {selected.length > 0 ? `(${selected.length})` : ""}
          </Button>
        </>
      }
    >
      <SimpleSelector
        placeholder="Search topics..."
        {...rest}
        onMap={(topic) => {
          const targetCount = getTargetCount(topic);
          const isSelected = !!selected.find((t) => t.$id === topic.$id);
          const hasTargets = true; // targetCount > 0;

          return (
            <div
              key={topic.$id}
              className={cn("w-full border-b border-dotted border-neutral-medium")}
            >
              <HStack
                color={!hasTargets ? "fg.subtle" : "fg"}
                alignItems="center"
                width="full"
                mb="2"
                pt="2"
              >
                <Checkbox
                  size="sm"
                  checked={isSelected}
                  onCheckedChange={() => toggleSelected(topic)}
                />
                <Text flex="1">
                  {topic.name}
                  <Code color={!hasTargets ? "fg.subtle" : "fg"} variant="surface" ml="3">
                    {targetCount} {targetCount === 1 ? "target" : "targets"}
                  </Code>
                </Text>
              </HStack>
            </div>
          );
        }}
      />
    </SelectDialog>
  );
};
