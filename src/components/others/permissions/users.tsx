import React from "react";
import { PermissionsEditorProps } from "./permissions";
import { Query } from "@nuvix/console";
import { SimpleSelector, usePaginatedSelector } from "../simple-selector";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { Checkbox } from "@/components/cui/checkbox";
import { Avatar } from "@/ui/components";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export type UserRoleProps = {
  addRole: (role: string) => void;
  onClose: VoidFunction;
  groups: Map<string, any>;
} & Pick<PermissionsEditorProps, "sdk">;

export const UserRole = ({ addRole, sdk, onClose, groups }: UserRoleProps) => {
  const fetchUsers = async (search: string | undefined, limit: number, offset: number) => {
    let queris = [];
    queris.push(Query.limit(limit), Query.offset(offset));
    const res = await sdk.users.list(queris, search);
    return { data: res.users, total: res.total };
  };

  const { ...rest } = usePaginatedSelector({ fetchFunction: fetchUsers, limit: 10 });

  const onSave = () => {
    for (const role of rest.selections) {
      addRole(`user:${role}`);
    }
    onClose?.();
  };

  return (
    <>
        <DialogHeader>
          <DialogTitle>Select users</DialogTitle>
          <DialogDescription>
            Grant access to any authenticated or anonymous user.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <SimpleSelector
            placeholder="Search users by name, email, phone or ID"
            {...rest}
            onMap={(user, toggleSelection, selections) => {
              const isExists = groups.has(`user:${user.$id}`);
              return (
                <HStack
                  key={user.$id}
                  gap={6}
                  alignItems="center"
                  width="full"
                  borderBottom={"1px solid"}
                  borderColor={"bg.muted"}
                  px={4}
                  py={2}
                >
                  <Checkbox
                    disabled={isExists}
                    checked={isExists ? true : selections.includes(user.$id)}
                    onCheckedChange={() => toggleSelection(user.$id)}
                  >
                    <HStack gap={2} alignItems="center">
                      <Avatar src={sdk.avatars.getInitials(user.name)} />
                      <VStack alignItems="flex-start" gap={0}>
                        <Text textStyle="sm">{user.name}</Text>
                        <Text textStyle="xs" color={"fg.subtle"}>
                          {user.$id}
                        </Text>
                      </VStack>
                    </HStack>
                  </Checkbox>
                </HStack>
              );
            }}
          />
        </DialogContent>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button disabled={rest.selections.length === 0} onClick={onSave}>
            Add
          </Button>
        </DialogFooter>
    </>
  );
};
