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
import { useState, useEffect, useCallback, useRef } from "react";
import { CloseButton } from "@/components/ui/close-button";

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
};

export const PermissionsEditor = ({
  permissions,
  withCreate,
  onChange,
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
                  <PopoverBox addRole={addRole}>
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
            <PopoverBox addRole={addRole}>
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

const PopoverBox = ({
  addRole,
  children,
}: { addRole: (role: string) => void; children: React.ReactNode }) => {
  const roles = [
    { role: "Any", onClick: () => addRole("any") },
    { role: "All Guests", onClick: () => addRole("all_guests") },
    { role: "All Users", onClick: () => addRole("all_users") },
    { role: "Select Users", onClick: () => addRole("select_users") },
    { role: "Select Teams", onClick: () => addRole("select_teams") },
    { role: "Label", onClick: () => addRole("label") },
    { role: "Custom Permission", onClick: () => addRole("custom_permission") },
  ];

  return (
    <PopoverRoot size="xs">
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent maxWidth="56">
        <PopoverArrow />
        <PopoverBody>
          <VStack>
            {roles.map((role, index) => (
              <Button
                key={index}
                variant="ghost"
                width="full"
                justifyContent="flex-start"
                onClick={role.onClick}
              >
                {role.role}
              </Button>
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};
