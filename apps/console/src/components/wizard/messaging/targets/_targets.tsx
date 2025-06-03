import React from "react";
import { Models, Query } from "@nuvix/console";
import { Accordion, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { Checkbox } from "@/components/cui/checkbox";
import { Avatar } from "@nuvix/ui/components";
import { DialogTrigger } from "@/components/cui/dialog";
import {
  SelectBox1,
  SelectDialog,
  SimpleSelector,
  usePaginatedSelector,
} from "@/components/others";
import { ProjectSdk } from "@/lib/sdk";

export type TargetProps = {
  add: (target: Models.Target) => void;
  onClose: VoidFunction;
  groups: Map<string, string>;
} & { sdk: ProjectSdk };

export const Targets = ({ add, sdk, onClose, groups }: TargetProps) => {
  const fetchUsers = async (search: string | undefined, limit: number, offset: number) => {
    let queris = [];
    queris.push(Query.limit(limit), Query.offset(offset));
    const res = await sdk.users.list(queris, search);
    return { data: res.users, total: res.total };
  };

  const { ...rest } = usePaginatedSelector({ fetchFunction: fetchUsers, limit: 10 });

  const onSave = () => {
    for (const target of rest.selections) {
      const [userId, targetId] = target.split(":");
      const index = rest.data.findIndex((t) => t.$id === userId);
      add(rest.data[index].targets.find((t) => t.$id === targetId)!);
    }
    onClose?.();
  };

  return (
    <>
      <SelectDialog
        title="Select targets"
        description="Grant access to any authenticated or anonymous user."
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
        <Accordion.Root collapsible defaultValue={["info"]}>
          <SimpleSelector
            placeholder="Search users by name, email, phone or ID"
            {...rest}
            onMap={(user, toggleSelection, selections) => {
              const isExists = groups.has(`user:${user.$id}`);
              return (
                <HStack key={user.$id} alignItems="center" width="full">
                  <Accordion.Item value={user.$id}>
                    <Accordion.ItemTrigger>
                      {/* <Icon fontSize="lg" color="fg.subtle">
                          {item.icon}
                        </Icon> */}
                      {user.name}
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      ii
                      {/* <Accordion.ItemBody>{item.content}</Accordion.ItemBody> */}
                    </Accordion.ItemContent>
                  </Accordion.Item>
                  {/* <SelectBox1
                  title={user.name}
                  desc={user.$id}
                  src={sdk.avatars.getInitials(user.name)}
                  checked={isExists ? true : selections.includes(user.$id)}
                  disabled={isExists}
                  onClick={() => toggleSelection(user.$id)}
                /> */}
                </HStack>
              );
            }}
          />
        </Accordion.Root>
      </SelectDialog>
    </>
  );
};
