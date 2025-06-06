import React, { useState } from "react";
import { MessagingProviderType, Models, Query } from "@nuvix/console";
import { Button, Code, HStack, Text } from "@chakra-ui/react";
import { Checkbox } from "@/components/cui/checkbox";
import { DialogTrigger } from "@/components/cui/dialog";
import { SelectDialog, SimpleSelector, usePaginatedSelector } from "@/components/others";
import { ProjectSdk } from "@/lib/sdk";
import { ChevronDown } from "lucide-react";
import { cn } from "@nuvix/sui/lib/utils";

export type TargetProps = {
  add: (target: Models.Target) => void;
  onClose: VoidFunction;
  groups: Record<string, Models.Target>;
  type?: MessagingProviderType;
  title?: string;
  description?: string;
} & { sdk: ProjectSdk };

export const Targets = ({ add, sdk, onClose, groups, type, title, description }: TargetProps) => {
  const fetchUsers = async (search: string | undefined, limit: number, offset: number) => {
    let queris = [];
    queris.push(Query.limit(limit), Query.offset(offset));
    const res = await sdk.users.list(queris, search);
    return { data: res.users, total: res.total };
  };

  const { selected, toggleSelected, ...rest } = usePaginatedSelector({
    fetchFunction: fetchUsers,
    limit: 10,
  });

  const onSave = () => {
    for (const target of selected as Models.Target[]) {
      add(target);
    }
    onClose?.();
  };

  return (
    <>
      <SelectDialog
        title={title ?? "Select targets"}
        description={description ?? "Grant access to any authenticated or anonymous user."}
        actions={
          <>
            <DialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogTrigger>
            <Button disabled={selected.length === 0} onClick={onSave}>
              Add
            </Button>
          </>
        }
      >
        <SimpleSelector
          placeholder="Search users by name, email, phone or ID"
          {...rest}
          onMap={(user, toggleSelection, selections) => {
            const [expended, setExpended] = useState(false);
            const targets = type
              ? user.targets.filter((t) => t.providerType === type)
              : user.targets;
            const disabled = targets.length === 0;
            const allSelected = targets.reduce(
              (p, c) =>
                groups.hasOwnProperty(c.$id) || selected.includes(c as any) ? [...p, c] : p,
              Object.values(groups) as Models.Target[],
            );

            return (
              <div
                key={user.$id}
                className={cn("w-full border-b border-dotted border-neutral-medium")}
              >
                <HStack
                  color={disabled ? "fg.subtle" : "fg"}
                  alignItems="center"
                  width="full"
                  mb={"2"}
                  pt={"2"}
                >
                  <Checkbox
                    size={"sm"}
                    disabled={disabled}
                    checked={
                      allSelected.length && allSelected.length === targets.length
                        ? true
                        : allSelected.length > 0
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={({ checked }) =>
                      checked === "indeterminate"
                        ? allSelected.forEach((t) => toggleSelected(t))
                        : targets.forEach((t) => toggleSelected(t))
                    }
                  />
                  <div
                    className="flex items-center gap-3 justify-between w-full cursor-pointer"
                    onClick={() => setExpended(!expended && !disabled)}
                  >
                    <Text>
                      {user.name ??
                        (targets[0]?.providerType === MessagingProviderType.Email
                          ? user.email
                          : undefined) ??
                        (targets[0]?.providerType === MessagingProviderType.Sms
                          ? user.phone
                          : undefined) ??
                        user.$id}
                      <Code color={disabled ? "fg.subtle" : "fg"} variant="surface" ml={"3"}>
                        {allSelected.length}/{targets.length} targets
                      </Code>
                    </Text>
                    <ChevronDown
                      className={cn("size-4 transition-all", {
                        "rotate-180": expended,
                      })}
                    />
                  </div>
                </HStack>
                {expended ? (
                  <div className="flex flex-col gap-1 ml-7 mb-2">
                    {targets.map((t) => (
                      <div className="flex gap-2 items-center">
                        <Checkbox
                          size={"sm"}
                          disabled={disabled}
                          checked={!!groups[t.$id] || selected.includes(t)}
                          onCheckedChange={() => toggleSelected(t)}
                        />
                        <Code variant="surface">{t.providerType}</Code>
                        <Text color={"fg.muted"}>{t.identifier}</Text>
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          }}
        />
      </SelectDialog>
    </>
  );
};
