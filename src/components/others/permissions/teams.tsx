import React from "react";
import { PermissionsEditorProps } from "./permissions";
import { Query } from "@nuvix/console";
import { SimpleSelector, usePaginatedSelector } from "../simple-selector";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { Checkbox } from "@/components/cui/checkbox";
import { Avatar } from "@/ui/components";
import { SelectBox1, SelectDialog } from "../select-dialog";
import { DialogTrigger } from "@/components/ui/dialog";

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
      <SelectDialog
        title="Select teams"
        description="You can grant access to any member of a specific team by selecting the team from the
            list below. To grant access to team members with specific roles, please set a custom
            permission."
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
          placeholder="Search teams by name or ID"
          {...rest}
          onMap={(team, toggleSelection, selections) => {
            const isExists = groups.has(`team:${team.$id}`);
            return (
              <HStack key={team.$id} alignItems="center" width="full">
                <SelectBox1
                  title={team.name}
                  desc={team.$id}
                  src={sdk.avatars.getInitials(team.name)}
                  checked={isExists ? true : selections.includes(team.$id)}
                  disabled={isExists}
                  onClick={() => toggleSelection(team.$id)}
                />
              </HStack>
            );
          }}
        />
      </SelectDialog>
    </>
  );
};
