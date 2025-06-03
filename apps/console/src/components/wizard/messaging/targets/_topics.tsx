import React from "react";
import { Models, Query } from "@nuvix/console";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { Checkbox } from "@/components/cui/checkbox";
import { Avatar } from "@nuvix/ui/components";
import {
  SelectBox1,
  SelectDialog,
  SimpleSelector,
  usePaginatedSelector,
} from "@/components/others";
import { ProjectSdk } from "@/lib/sdk";
import { DialogTrigger } from "@/components/cui/dialog";

export type TopicsProps = {
  add: (topic: Models.Topic) => void;
  onClose: VoidFunction;
  groups: Map<string, string>;
} & { sdk: ProjectSdk };

export const Topics = ({ add, sdk, onClose, groups }: TopicsProps) => {
  const fetchUsers = async (search: string | undefined, limit: number, offset: number) => {
    let queris = [];
    queris.push(Query.limit(limit), Query.offset(offset));
    const res = await sdk.messaging.listTopics(queris, search);
    return { data: res.topics, total: res.total };
  };

  const { ...rest } = usePaginatedSelector({ fetchFunction: fetchUsers, limit: 10 });

  const onSave = () => {
    for (const topic of rest.selections) {
      add(rest.data.find(t => t.$id === topic)!);
    }
    onClose?.();
  };

  return (
    <>
      <SelectDialog
        title="Select topics"
        description="__"
        actions={
          <>
            <DialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogTrigger>
            <Button disabled={rest.selections.length === 0} onClick={onSave}>
              Add
            </Button>
          </>
        }
      >
        <SimpleSelector
          placeholder="Search users by name"
          {...rest}
          onMap={(topic, toggleSelection, selections) => {
            const isExists = groups.has(topic.$id);
            return (
              <HStack key={topic.$id} alignItems="center" width="full">
                <SelectBox1
                  title={topic.name}
                  desc={topic.$id}
                  src={sdk.avatars.getInitials(topic.name)}
                  checked={isExists ? true : selections.includes(topic.$id)}
                  disabled={isExists}
                  onClick={() => toggleSelection(topic.$id)}
                />
              </HStack>
            );
          }}
        />
      </SelectDialog>
    </>
  );
};
