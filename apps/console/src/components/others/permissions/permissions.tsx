import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@nuvix/cui/popover";
import { Card, Checkbox, IconButton } from "@nuvix/ui/components";
import { Table, Text, VStack } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { CloseButton } from "@nuvix/cui/close-button";
import { sdkForConsole, sdkForProject } from "@/lib/sdk";
import { UserRole } from "./users";
import { TeamRole } from "./teams";
import { RoleHover } from "./row";
import { LabelRole } from "./label";
import { CustomRole } from "./custom";
import { Button } from "@nuvix/sui/components/button";
import { DialogRoot } from "@nuvix/cui/dialog";

export type Permission = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export type PermissionsTypes = "create" | "read" | "update" | "delete";

export type PermissionsEditorProps = {
  withCreate?: boolean;
  permissions: string[];
  onChange?: (permissions: string[]) => void;
  sdk: typeof sdkForConsole | typeof sdkForProject;
};

export const PermissionsEditor = ({
  permissions,
  withCreate,
  onChange,
  sdk,
}: PermissionsEditorProps) => {
  const [groups, setGroups] = useState<Map<string, Permission>>(new Map());

  useEffect(() => {
    const newGroups = new Map<string, Permission>();
    permissions.forEach((permission) => {
      const type = permission.slice(0, permission.indexOf("("));
      const role = permission.slice(permission.indexOf('("') + 2, permission.indexOf('")'));

      if (!newGroups.has(role)) {
        newGroups.set(role, { create: false, read: false, update: false, delete: false });
      }

      newGroups.get(role)![type as PermissionsTypes] = true;
    });
    setGroups(newGroups);
  }, [permissions]);

  const addRole = useCallback((role: string) => {
    setGroups((prev) => {
      if (prev.has(role)) return prev;
      const newGroups = new Map(prev);
      newGroups.set(role, { create: false, read: false, update: false, delete: false });
      return newGroups;
    });
  }, []);

  const togglePermission = useCallback((role: string, permission: PermissionsTypes) => {
    setGroups((prev) => {
      const newGroups = new Map(prev);
      const updatedPermission = {
        ...newGroups.get(role)!,
        [permission]: !newGroups.get(role)![permission],
      };
      newGroups.set(role, updatedPermission);
      return newGroups;
    });
  }, []);

  const deleteRole = useCallback((role: string) => {
    setGroups((prev) => {
      const newGroups = new Map(prev);
      newGroups.delete(role);
      return newGroups;
    });
  }, []);

  const convertGroupsToPermissions = useCallback((groups: Map<string, Permission>): string[] => {
    return Array.from(groups.entries()).flatMap(([role, permission]) =>
      (Object.entries(permission) as [PermissionsTypes, boolean][])
        .filter(([_, value]) => value)
        .map(([key]) => `${key}("${role}")`),
    );
  }, []);

  const prevPermissionsRef = useRef<string[]>(permissions);

  function sortRoles([a]: [string, Permission], [b]: [string, Permission]) {
    if ((a === "any") !== (b === "any")) {
      return a === "any" ? -1 : 1;
    }
    if ((a === "users") !== (b === "users")) {
      return a === "users" ? -1 : 1;
    }
    if ((a === "guests") !== (b === "guests")) {
      return a === "guests" ? -1 : 1;
    }

    return a.localeCompare(b);
  }

  useEffect(() => {
    const newPermissions = convertGroupsToPermissions(groups);
    if (JSON.stringify(newPermissions) !== JSON.stringify(prevPermissionsRef.current)) {
      prevPermissionsRef.current = newPermissions;
      onChange?.(newPermissions);
    }
  }, [groups, onChange, permissions]);

  return (
    <>
      <VStack width={"full"} position="relative" alignItems={"flex-start"}>
        {groups.size > 0 ? (
          <Table.ScrollArea
            borderRadius="lg"
            border="1px solid"
            borderColor="var(--surface-border)"
          >
            <Table.Root tableLayout="fixed" variant="line" bg={"var(--surface-background)"}>
              <Table.Header>
                <Table.Row bg="transparent" borderColor={"var(--surface-border)"}>
                  <Table.ColumnHeader width="28" textTransform="uppercase" color="fg.muted">
                    Role
                  </Table.ColumnHeader>
                  {withCreate && (
                    <Table.ColumnHeader width="16" textTransform="uppercase" color="fg.muted">
                      Create
                    </Table.ColumnHeader>
                  )}
                  <Table.ColumnHeader width="16" textTransform="uppercase" color="fg.muted">
                    Read
                  </Table.ColumnHeader>
                  <Table.ColumnHeader width="16" textTransform="uppercase" color="fg.muted">
                    Update
                  </Table.ColumnHeader>
                  <Table.ColumnHeader width="16" textTransform="uppercase" color="fg.muted">
                    Delete
                  </Table.ColumnHeader>
                  <Table.ColumnHeader width="12" />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {[...groups].sort(sortRoles).map(([role, permission]) => (
                  <Table.Row key={role} bg="transparent" borderColor={"var(--surface-border)"}>
                    <Table.Cell truncate>
                      <RoleHover role={role} sdk={sdk} />
                    </Table.Cell>
                    {withCreate && (
                      <Table.Cell>
                        <Checkbox
                          isChecked={permission.create}
                          onToggle={() => togglePermission(role, "create")}
                        />
                      </Table.Cell>
                    )}
                    <Table.Cell>
                      <Checkbox
                        isChecked={permission.read}
                        onToggle={() => togglePermission(role, "read")}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Checkbox
                        isChecked={permission.update}
                        onToggle={() => togglePermission(role, "update")}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Checkbox
                        isChecked={permission.delete}
                        onToggle={() => togglePermission(role, "delete")}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <CloseButton colorPalette="red" size="xs" onClick={() => deleteRole(role)} />
                    </Table.Cell>
                  </Table.Row>
                ))}
                <Table.Row width="full" bg="transparent">
                  <PopoverBox addRole={addRole} sdk={sdk} groups={groups}>
                    <Button variant="ghost" size="sm">
                      <LuPlus />
                      Add Role
                    </Button>
                  </PopoverBox>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        ) : (
          <Card
            title="Permissions"
            minHeight="160"
            radius="l-4"
            center
            fillWidth
            direction="column"
            gap="12"
          >
            <PopoverBox addRole={addRole} sdk={sdk} groups={groups}>
              <IconButton variant="secondary" size="m">
                <LuPlus />
              </IconButton>
            </PopoverBox>
            <Text textStyle="sm" color="var(--neutral-on-background-weak)">
              No roles added yet. Click "+" to begin.
            </Text>
          </Card>
        )}
      </VStack>
    </>
  );
};

export type PopoverBoxProps = {
  addRole: (role: string) => void;
  children: React.ReactNode;
  groups: Map<string, Permission>;
} & Pick<PermissionsEditorProps, "sdk">;

export const PopoverBox = ({ addRole, children, sdk, groups }: PopoverBoxProps) => {
  const [open, setOpen] = useState(false);
  const [comp, setComp] = useState<React.JSX.Element>();

  const handleRoleClick = (role?: string, component?: React.JSX.Element | null) => {
    if (component) {
      setComp(component);
      setOpen(true);
    } else {
      addRole(role!);
    }
  };

  const roles = [
    { label: "Any", role: "any", component: null },
    { label: "All Guests", role: "guests", component: null },
    { label: "All Users", role: "users", component: null },
    {
      label: "Select Users",
      component: (
        <UserRole addRole={addRole} sdk={sdk} onClose={() => setOpen(false)} groups={groups} />
      ),
    },
    {
      label: "Select Teams",
      component: (
        <TeamRole addRole={addRole} sdk={sdk} onClose={() => setOpen(false)} groups={groups} />
      ),
    },
    {
      label: "Label",
      component: <LabelRole addRole={addRole} onClose={() => setOpen(false)} groups={groups} />,
    },
    {
      label: "Custom Permission",
      component: <CustomRole addRole={addRole} onClose={() => setOpen(false)} groups={groups} />,
    },
  ];

  return (
    <>
      <PopoverRoot size="xs" portalled={false}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent maxWidth="56" css={{ "--popover-bg": "var(--neutral-background-weak)" }}>
          <PopoverArrow />
          <PopoverBody overflowY="auto">
            <VStack width="full">
              {roles.map(({ role, component, label }, index) => (
                <PopoverTrigger key={index} width="full">
                  <Button
                    variant="ghost"
                    onClick={() => handleRoleClick(role, component)}
                    className="w-full justify-start"
                  >
                    {label}
                  </Button>
                </PopoverTrigger>
              ))}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>

      <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
        {comp}
      </DialogRoot>
    </>
  );
};
