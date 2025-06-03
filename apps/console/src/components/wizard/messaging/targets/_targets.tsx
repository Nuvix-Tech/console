import React from "react";
import { Query } from "@nuvix/console";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
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

export type UserRoleProps = {
  addRole: (role: string) => void;
  onClose: VoidFunction;
  groups: Map<string, any>;
} & { sdk: ProjectSdk };

export const Targets = ({ addRole, sdk, onClose, groups }: UserRoleProps) => {
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
      <SelectDialog
        title="Select users"
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
        <SimpleSelector
          placeholder="Search users by name, email, phone or ID"
          {...rest}
          onMap={(user, toggleSelection, selections) => {
            const isExists = groups.has(`user:${user.$id}`);
            return (
              <HStack key={user.$id} alignItems="center" width="full">
                <SelectBox1
                  title={user.name}
                  desc={user.$id}
                  src={sdk.avatars.getInitials(user.name)}
                  checked={isExists ? true : selections.includes(user.$id)}
                  disabled={isExists}
                  onClick={() => toggleSelection(user.$id)}
                />
              </HStack>
            );
          }}
        />
      </SelectDialog>
    </>
  );
};
