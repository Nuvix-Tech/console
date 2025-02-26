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
  groups: Map<string, any>;
} & Pick<PermissionsEditorProps, "sdk">;

export const TeamRole = ({ addRole, sdk, onClose, groups }: TeamRoleProps) => {
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
          <DialogTitle>Select teams</DialogTitle>
          <DialogDescription>
            You can grant access to any member of a specific team by selecting the team from the
            list below. To grant access to team members with specific roles, please set a custom
            permission.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <SimpleSelector
            placeholder="Search teams by name or ID"
            {...rest}
            onMap={(team, toggleSelection, selections) => {
              const isExists = groups.has(`team:${team.$id}`);
              return (
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
                    disabled={isExists}
                    checked={isExists ? true : selections.includes(team.$id)}
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
              );
            }}
          />
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button disabled={rest.selections.length === 0} onClick={onSave}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
};
