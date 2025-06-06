import React from "react";
import { MessagingProviderType, Models, Query } from "@nuvix/console";
import { Button, HStack, Text, Code } from "@chakra-ui/react";
import { SelectDialog, SimpleSelector, usePaginatedSelector } from "@/components/others";
import { ProjectSdk } from "@/lib/sdk";
import { DialogTrigger } from "@/components/cui/dialog";
import { Checkbox } from "@/components/cui/checkbox";
import { cn } from "@nuvix/sui/lib/utils";

export type TopicsProps = {
  add: (topic: Models.Topic) => void;
  onClose: VoidFunction;
  groups: Record<string, Models.Topic>;
  type: MessagingProviderType;
} & { sdk: ProjectSdk };

export const Topics = ({ add, sdk, onClose, groups, type }: TopicsProps) => {
  const fetchTopics = async (search: string | undefined, limit: number, offset: number) => {
    let queris = [];
    queris.push(Query.limit(limit), Query.offset(offset));
    const res = await sdk.messaging.listTopics(queris, search);
    return { data: res.topics, total: res.total };
  };

  const { selected, toggleSelected, ...rest } = usePaginatedSelector({
    fetchFunction: fetchTopics,
    limit: 10,
  });

  const onSave = () => {
    for (const topic of selected as Models.Topic[]) {
      add(topic);
    }
    onClose?.();
  };

  const getTotal = (topic: Models.Topic): number => {
    switch (type) {
      case MessagingProviderType.Email:
        return topic.emailTotal;
      case MessagingProviderType.Sms:
        return topic.smsTotal;
      case MessagingProviderType.Push:
        return topic.pushTotal;
      default:
        return 0;
    }
  };

  return (
    <>
      <SelectDialog
        title="Select topics"
        description="Grant access to any authenticated or anonymous user."
        actions={
          <>
            <DialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogTrigger>
            <Button disabled={selected.length === 0} onClick={onSave}>
              Add
            </Button>
          </>
        }
      >
        <SimpleSelector
          placeholder="Search by topics"
          {...rest}
          onMap={(topic, toggleSelection, selections) => {
            const targets = getTotal(topic);
            const disabled = targets > 0;
            return (
              <div
                key={topic.$id}
                className={cn("w-full border-b border-dotted border-neutral-medium")}
              >
                <HStack
                  color={disabled ? "fg.subtle" : "fg"}
                  alignItems="center"
                  width="full"
                  mb={"2"}
                  pt={"2"}
                >
                  <Checkbox
                    size={"sm"}
                    disabled={disabled}
                    checked={!!groups[topic.$id] || selected.find((t) => t.$id === topic.$id)}
                    onCheckedChange={() => toggleSelected(topic)}
                  />
                  <Text>
                    {topic.name}
                    <Code color={disabled ? "fg.subtle" : "fg"} variant="surface" ml={"3"}>
                      {targets} targets
                    </Code>
                  </Text>
                </HStack>
              </div>
            );
          }}
        />
      </SelectDialog>
    </>
  );
};
