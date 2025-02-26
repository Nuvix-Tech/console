import React from "react";
import { PermissionsEditorProps } from "./permissions";
import { Query } from "@nuvix/console";
import { SimpleSelector, usePaginatedSelector } from "../simple-selector";
import { Button, DialogHeader, DialogTitle, HStack, Text, VStack } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/ui/components";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";

export type UserRoleProps = {
  addRole: (role: string) => void;
} & Pick<PermissionsEditorProps, "sdk">;

export const UserRole = ({ addRole, sdk }: UserRoleProps) => {
  const fetchUsers = async (search: string | undefined, limit: number, offset: number) => {
    let queris = [];
    queris.push(Query.limit(limit), Query.offset(offset));
    const res = await sdk.users.list(queris, search);
    return { data: res.users, total: res.total };
  };

  const { ...rest } = usePaginatedSelector({ fetchFunction: fetchUsers, limit: 10 });

  const onSave = () => {
    for (const role of rest.selections) {
      addRole(role);
    }
  };

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Users</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text>Select users to assign roles. Use the search bar to filter users by name.</Text>
          <SimpleSelector
            placeholder="Search users by name, email, phone or ID"
            {...rest}
            onMap={(user, toggleSelection, selections) => (
              <>
                <HStack
                  key={user.$id}
                  gap={4}
                  alignItems="center"
                  width="full"
                  borderBottom={"1px solid"}
                  borderColor={"bg.muted"}
                  px={4}
                  py={2}
                >
                  <Checkbox
                    checked={selections.includes(user.$id)}
                    onToggle={() => toggleSelection(user.$id)}
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
              </>
            )}
          />
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
};
