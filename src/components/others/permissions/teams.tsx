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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export type TeamRoleProps = {
  addRole: (role: string) => void;
  onClose: VoidFunction;
} & Pick<PermissionsEditorProps, "sdk">;

export const TeamRole = ({ addRole, sdk, onClose }: TeamRoleProps) => {
  const fetchTeams = async (search: string | undefined, limit: number, offset: number) => {
    let queris = [];
    queris.push(Query.limit(limit), Query.offset(offset));
    const res = await sdk.teams.list(queris, search);
    return { data: res.teams, total: res.total };
  };

  const { ...rest } = usePaginatedSelector({ fetchFunction: fetchTeams, limit: 10 });

  const onSave = () => {
    for (const role of rest.selections) {
      addRole(`team:${role}`);
    }
    onClose?.();
  };

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Team</DialogTitle>
          <DialogDescription>
            Select team to assign roles. Use the search bar to filter team by name.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <SimpleSelector
            placeholder="Search teams by name or ID"
            {...rest}
            onMap={(team, toggleSelection, selections) => (
              <HStack
                key={team.$id}
                gap={6}
                alignItems="center"
                width="full"
                borderBottom={"1px solid"}
                borderColor={"bg.muted"}
                px={4}
                py={2}
              >
                <Checkbox
                  checked={selections.includes(team.$id)}
                  onCheckedChange={() => toggleSelection(team.$id)}
                >
                  <HStack gap={2} alignItems="center">
                    <Avatar src={sdk.avatars.getInitials(team.name)} />
                    <VStack alignItems="flex-start" gap={0}>
                      <Text textStyle="sm">{team.name}</Text>
                      <Text textStyle="xs" color={"fg.subtle"}>
                        {team.$id}
                      </Text>
                    </VStack>
                  </HStack>
                </Checkbox>
              </HStack>
            )}
          />
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button disabled={rest.selections.length === 0} onClick={onSave}>
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
};
