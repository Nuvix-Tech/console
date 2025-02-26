import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@/components/ui/popover";
import { Card, Checkbox, IconButton } from "@/ui/components";
import { Button, Table, VStack } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { CloseButton } from "@/components/ui/close-button";
import { sdkForConsole, sdkForProject } from "@/lib/sdk";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserRole } from "./users";

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
          <Table.ScrollArea borderRadius="xl">
            <Table.Root tableLayout="fixed" variant="outline" bg={"bg.muted"}>
              <Table.Header>
                <Table.Row>
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
                {[...groups.entries()].map(([role, permission]) => (
                  <Table.Row key={role}>
                    <Table.Cell>{role}</Table.Cell>
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
                <Table.Row>
                  <PopoverBox addRole={addRole} sdk={sdk}>
                    <Button variant="subtle" size="sm">
                      <LuPlus />
                      Add Role
                    </Button>
                  </PopoverBox>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        ) : (
          <Card title="Permissions" minHeight="160" radius="l-4" center fillWidth>
            <PopoverBox addRole={addRole} sdk={sdk}>
              <IconButton variant="secondary" size="m">
                <LuPlus />
              </IconButton>
            </PopoverBox>
          </Card>
        )}
      </VStack>
    </>
  );
};

export type PopoverBoxProps = {
  addRole: (role: string) => void;
  children: React.ReactNode;
} & Pick<PermissionsEditorProps, "sdk">;

const PopoverBox = ({ addRole, children, sdk }: PopoverBoxProps) => {
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
    { label: "Select Users", component: <UserRole addRole={addRole} sdk={sdk} /> },
    { label: "Select Teams", component: null },
    { label: "Label", component: null },
    { label: "Custom Permission", component: null },
  ];

  return (
    <>
      <PopoverRoot size="xs">
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent maxWidth="56">
          <PopoverArrow />
          <PopoverBody>
            <VStack>
              {roles.map(({ role, component, label }, index) => (
                <PopoverTrigger asChild key={index}>
                  <Button
                    variant="ghost"
                    width="full"
                    justifyContent="flex-start"
                    onClick={() => handleRoleClick(role, component)}
                  >
                    {label}
                  </Button>
                </PopoverTrigger>
              ))}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>

      <DialogRoot
        lazyMount
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        placement="center"
        size="lg"
      >
        {comp}
      </DialogRoot>
    </>
  );
};
