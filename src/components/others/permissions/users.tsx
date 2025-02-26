import React from "react";
import { PermissionsEditorProps } from "./permissions";
import { Models } from "@nuvix/console";
import { SimpleSelector } from "../simple-selector";
import { HStack, Text, VStack } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/ui/components";

export type UserRoleProps = {
  addRole: (role: string) => void;
} & Pick<PermissionsEditorProps, "sdk">;

export const UserRole = ({ addRole, sdk }: UserRoleProps) => {
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState<string | undefined>();
  const [usersList, setUserList] = React.useState<Models.UserList<any>>();

  React.useEffect(() => {
    const fetch = async () => {
      let u = await sdk.users.list([], search);
      setUserList(u);
      setLoading(false);
    };
    fetch();
  }, [sdk, search]);

  return (
    <>
      <SimpleSelector
        data={usersList?.users ?? []}
        loading={loading}
        search={search}
        setSearch={setSearch}
        onSelect={(f: string) => {}}
        total={usersList?.total}
        onMap={(user, i, onSelect) => (
          <>
            <HStack
              key={i}
              gap={4}
              alignItems="center"
              width="full"
              borderBottom={"1px solid"}
              borderColor={"bg.muted"}
              px={4}
              py={2}
            >
              <Checkbox checked={false} onToggle={() => {}} />
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
    </>
  );
};
