import React, { useEffect, useState } from "react";
import { MessagingProviderType, Models, Query } from "@nuvix/console";
import { Button, Code, HStack, Text } from "@chakra-ui/react";
import { Checkbox } from "@/components/cui/checkbox";
import { DialogTrigger } from "@/components/cui/dialog";
import { SelectDialog, SimpleSelector, usePaginatedSelector } from "@/components/others";
import { ProjectSdk } from "@/lib/sdk";
import { ChevronDown } from "lucide-react";
import { cn } from "@nuvix/sui/lib/utils";

export type TargetProps = {
  add: (targets: Models.Target[]) => void;
  onClose: VoidFunction;
  groups: Record<string, Models.Target>;
  type?: MessagingProviderType;
  title?: string;
  description?: string;
} & { sdk: ProjectSdk };

export const Targets = ({ add, sdk, onClose, groups, type, title, description }: TargetProps) => {
  const fetchUsers = async (search: string | undefined, limit: number, offset: number) => {
    const queries = [];
    queries.push(Query.limit(limit), Query.offset(offset));
    const res = await sdk.users.list(queries, search);
    return { data: res.users, total: res.total };
  };

  const { selected, toggleSelected, setSelected, ...rest } = usePaginatedSelector<
    Models.User<any>,
    Models.Target
  >({
    fetchFunction: fetchUsers,
    limit: 10,
  });

  const onSave = () => {
    add(selected);
    onClose?.();
  };

  useEffect(() => {
    const values = Object.values(groups);
    if (values.length) setSelected(values);
  }, [groups, setSelected]);

  return (
    <>
      <SelectDialog
        title={title ?? "Select Message Targets"}
        description={
          description ??
          "Choose users to send messages to. Only users with valid messaging targets will be selectable."
        }
        actions={
          <>
            <DialogTrigger asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogTrigger>
            <Button disabled={selected.length === 0} onClick={onSave} type="button">
              Add {selected.length} Target{selected.length !== 1 ? "s" : ""}
            </Button>
          </>
        }
      >
        <SimpleSelector
          placeholder="Search users by name, email, phone, or user ID"
          {...rest}
          onMap={(user) => {
            const [expanded, setExpanded] = useState(false);
            const availableTargets = type
              ? user.targets.filter((t) => t.providerType === type)
              : user.targets;
            const hasTargets = availableTargets.length > 0;

            const selectedTargets = availableTargets.filter((target) =>
              selected.some(
                (selectedTarget) =>
                  selectedTarget.$id === target.$id && selectedTarget.userId === user.$id,
              ),
            );

            const isFullySelected =
              hasTargets && selectedTargets.length === availableTargets.length;
            const isPartiallySelected =
              selectedTargets.length > 0 && selectedTargets.length < availableTargets.length;

            const getUserDisplayName = () => {
              if (user.name) return user.name;
              if (type === MessagingProviderType.Email && user.email) return user.email;
              if (type === MessagingProviderType.Sms && user.phone) return user.phone;
              return user.$id;
            };

            const handleUserToggle = () => {
              if (isPartiallySelected) {
                // If partially selected, deselect all
                selectedTargets.forEach((target) => toggleSelected(target));
              } else {
                // If fully selected or not selected, toggle all
                availableTargets.forEach((target) => toggleSelected(target));
              }
            };

            return (
              <div
                key={user.$id}
                className={cn("w-full border-b border-dotted border-neutral-medium")}
              >
                <HStack
                  color={hasTargets ? "fg" : "fg.subtle"}
                  alignItems="center"
                  width="full"
                  mb={"2"}
                  pt={"2"}
                >
                  <Checkbox
                    size={"sm"}
                    disabled={!hasTargets}
                    checked={isFullySelected ? true : isPartiallySelected ? "indeterminate" : false}
                    onCheckedChange={handleUserToggle}
                  />
                  <div
                    className={cn(
                      "flex items-center gap-3 justify-between w-full",
                      hasTargets ? "cursor-pointer" : "cursor-not-allowed",
                    )}
                    onClick={() => hasTargets && setExpanded(!expanded)}
                  >
                    <Text>
                      {getUserDisplayName()}
                      <Code color={hasTargets ? "fg" : "fg.subtle"} variant="surface" ml={"3"}>
                        {hasTargets
                          ? `${selectedTargets.length}/${availableTargets.length} selected`
                          : "No targets available"}
                      </Code>
                    </Text>
                    {hasTargets && (
                      <ChevronDown
                        className={cn("size-4 transition-all", {
                          "rotate-180": expanded,
                        })}
                      />
                    )}
                  </div>
                </HStack>
                {expanded && hasTargets && (
                  <div className="flex flex-col gap-1 ml-7 mb-2">
                    {availableTargets.map((target) => (
                      <div className="flex gap-2 items-center" key={target.$id}>
                        <Checkbox
                          size={"sm"}
                          checked={selectedTargets.some((t) => t.$id === target.$id)}
                          onCheckedChange={() => toggleSelected(target)}
                        />
                        <Code variant="surface">{target.providerType}</Code>
                        <Text color={"fg.muted"}>{target.identifier}</Text>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }}
        />
      </SelectDialog>
    </>
  );
};
