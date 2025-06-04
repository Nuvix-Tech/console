import React, { useState } from "react";
import { MessagingProviderType, Models, Query } from "@nuvix/console";
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
import { ChevronDown } from "lucide-react";
import { cn } from "@nuvix/sui/lib/utils";

export type TargetProps = {
  add: (target: Models.Target) => void;
  onClose: VoidFunction;
  groups: Map<string, string>;
  type: MessagingProviderType;
} & { sdk: ProjectSdk };

export const Targets = ({ add, sdk, onClose, groups, type }: TargetProps) => {
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
        <SimpleSelector
          placeholder="Search users by name, email, phone or ID"
          {...rest}
          onMap={(user, toggleSelection, selections) => {
            const isExists = groups.has(`user:${user.$id}`);
            const [expended, setExpended] = useState(false);
            const targets = user.targets.filter((t) => t.providerType === type);
            const disabled = !targets.length;

            return (
              <div key={user.$id} className={cn("w-full border-b border-neutral-medium")}>
                <HStack
                  color={disabled ? "fg.subtle" : "fg"}
                  alignItems="center"
                  width="full"
                  justifyContent={"space-between"}
                  mb={"2"}
                  py={"2"}
                  onClick={() => setExpended(!expended)}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox size={"sm"} disabled={disabled} />
                    <Text>
                      {targets[0]?.identifier ??
                        (targets[0]?.providerType === MessagingProviderType.Email
                          ? user.email
                          : undefined) ??
                        (targets[0]?.providerType === MessagingProviderType.Sms
                          ? user.phone
                          : undefined) ??
                        user.name ??
                        user.$id}
                    </Text>
                  </div>
                  <ChevronDown
                    className={cn("size-4", {
                      "rotate-180": expended,
                    })}
                  />
                  {/* <SelectBox1
                  title={user.name}
                  desc={user.$id}
                  src={sdk.avatars.getInitials(user.name)}
                  checked={isExists ? true : selections.includes(user.$id)}
                  disabled={isExists}
                  onClick={() => toggleSelection(user.$id)}
                /> */}
                </HStack>
                {expended ? <div>HELLO HOW ARE YOU</div> : ""}
              </div>
            );
          }}
        />
      </SelectDialog>
    </>
  );
};
