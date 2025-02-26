import React from "react";
import { PermissionsEditorProps } from "./permissions";
import { Models } from "@nuvix/console";
import { SimpleSelector } from "../simple-selector";
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
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState<string | undefined>();
  const [page, setPage] = React.useState(1);
  const [usersList, setUserList] = React.useState<Models.UserList<any>>();
  const [selections, setSelections] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetch = async () => {
      let u = await sdk.users.list([], search);
      setUserList(u);
      setLoading(false);
    };
    fetch();
  }, [sdk, search]);

  const onSave = () => {
    for (const role of selections) {
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
            data={usersList?.users ?? []}
            limit={10}
            onSelect={(user) => {
              setSelections((prevSelections) => {
                if (prevSelections.includes(user.$id)) {
                  return prevSelections.filter((id) => id !== user.$id);
                } else {
                  return [...prevSelections, user.$id];
                }
              });
            }}
            total={usersList?.total}
            {...{ page, setPage, search, loading, setSearch, selections }}
            onMap={(user, onSelect, selections) => (
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
                    onToggle={() => onSelect(user)}
                  />
                  <HStack gap={2} alignItems="center">
                    <Avatar src={sdk.avatars.getInitials(user.name)} />
                    <VStack alignItems="flex-start" gap={0}>
                      <Text textStyle="sm">{user.name}</Text>
                      <Text textStyle="xs" color={"fg.subtle"}>
                        {user.$id}
                      </Text>
                    </VStack>
                  </HStack>
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
