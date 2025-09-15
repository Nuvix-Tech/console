import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { useDatabaseRolesQuery } from "@/data/database-roles/database-roles-query";
import { useTablesQuery } from "@/data/tables/tables-query";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Command,
} from "@nuvix/sui/components/command";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  Select,
} from "@nuvix/sui/components/select";
import { PopoverContent, PopoverTrigger, Popover } from "@nuvix/sui/components/popover";
import { FormControl, FormItem, FormLabel, FormMessage } from "@nuvix/sui/components/form";
import { RadioGroup, RadioGroupItem } from "@nuvix/sui/components/radio-group";
import { useProjectStore } from "@/lib/store";
import { useCheckPermission } from "@/hooks/useCheckPermissions";
import { PermissionAction } from "@/types";
import { useFormikContext } from "formik";
import type { PolicyFormValues } from ".";
import { FieldWrapper, InputField, InputSelectField } from "@/components/others/forms";

interface PolicyDetailsV2Props {
  schema: string;
  searchString?: string;
  selectedTable?: string;
  isEditing: boolean;
  onUpdateCommand: (command: string) => void;
  authContext: "database" | "realtime";
}

export const PolicyDetailsV2 = ({
  schema,
  searchString,
  selectedTable,
  isEditing,
  onUpdateCommand,
  authContext,
}: PolicyDetailsV2Props) => {
  const { project, sdk } = useProjectStore();
  const [open, setOpen] = useState(false);
  const { can: canUpdatePolicies } = useCheckPermission(
    PermissionAction.TENANT_SQL_ADMIN_WRITE,
    "tables",
  );
  const form = useFormikContext<PolicyFormValues>();

  const { data: tables, isSuccess: isSuccessTables } = useTablesQuery({
    projectRef: project?.$id,
    sdk,
    schema: schema,
    sortByProperty: "name",
    includeColumns: true,
  });

  const { data: dbRoles } = useDatabaseRolesQuery({
    projectRef: project?.$id,
    sdk,
  });
  const formattedRoles = (dbRoles ?? [])
    .map((role) => {
      return {
        id: role.id,
        name: role.name,
        value: role.name,
        disabled: false,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (!isEditing && selectedTable === undefined) {
      const table = tables?.find(
        (table) =>
          table.schema === schema &&
          (table.id.toString() === searchString || table.name === searchString),
      );
      if (table) {
        form.setFieldValue("table", table.name);
      } else if (isSuccessTables && tables.length > 0) {
        form.setFieldValue("table", tables[0].name);
      }
    }
  }, [isEditing, form, searchString, tables, isSuccessTables, selectedTable]);

  return (
    <>
      <div className="px-5 py-5 flex flex-col gap-y-4 border-b">
        <div className="items-start justify-between gap-4 grid grid-cols-12">
          <InputField
            label="Policy Name"
            name="name"
            placeholder="Provide a name for your policy"
            disabled={!canUpdatePolicies}
            className="col-span-6"
          />

          {/* <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="col-span-6 flex flex-col gap-y-1">
                                <FormLabel>Policy Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={!canUpdatePolicies}
                                        className="bg-control border-control"
                                        placeholder="Provide a name for your policy"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

          {/* <FormField
                        control={form.control}
                        name="table"
                        render={({ field }) => (
                            <FormItem className="col-span-6 flex flex-col gap-y-1">
                                <FormLabel className="flex items-center gap-x-4">
                                    <p className="neutral-on-background-medium text-sm">Table</p>
                                    <p className="neutral-on-background-medium text-sm">
                                        <code className="text-xs">on</code> clause
                                    </p>
                                </FormLabel>
                                {authContext === 'database' && (
                                    <FormControl>
                                        <Popover open={open} onOpenChange={setOpen} modal={false}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="default"
                                                    disabled={!canUpdatePolicies}
                                                    className="w-full [&>span]:w-full h-[38px] text-sm"
                                                    iconRight={
                                                        <ChevronsUpDown
                                                            className="text-foreground-muted"
                                                            strokeWidth={2}
                                                            size={14}
                                                        />
                                                    }
                                                >
                                                    <div className="w-full flex gap-1">
                                                        <span className="text-foreground">
                                                            {schema}.{field.value}
                                                        </span>
                                                    </div>
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent
                                                className="p-0"
                                                side="bottom"
                                                align="start"
                                                sameWidthAsTrigger
                                            >
                                                <Command>
                                                    <CommandInput placeholder="Find a table..." />
                                                    <CommandList>
                                                        <CommandEmpty>No tables found</CommandEmpty>
                                                        <CommandGroup>
                                                            <ScrollArea className={(tables ?? []).length > 7 ? 'h-[200px]' : ''}>
                                                                {(tables ?? []).map((table) => (
                                                                    <CommandItem
                                                                        key={table.id}
                                                                        className="cursor-pointer flex items-center justify-between space-x-2 w-full"
                                                                        onSelect={() => {
                                                                            form.setFieldValue('table', table.name);
                                                                            setOpen(false);
                                                                        }}
                                                                        onClick={() => {
                                                                            form.setFieldValue('table', table.name);
                                                                            setOpen(false);
                                                                        }}
                                                                    >
                                                                        <span className="flex items-center gap-1.5">
                                                                            {field.value === table.name ? <Check size={13} /> : ''}
                                                                            {table.name}
                                                                        </span>
                                                                    </CommandItem>
                                                                ))}
                                                            </ScrollArea>
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                )}
                                {authContext === 'realtime' && (
                                    <FormControl>
                                        <Input
                                            disabled
                                            value="messages.realtime"
                                            className="bg-control border-control"
                                        />
                                    </FormControl>
                                )}

                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

          <InputSelectField
            portal={false}
            label={
              <div className="flex items-center gap-x-4">
                <p className="neutral-on-background-medium text-sm">Policy Behavior</p>
                <p className="neutral-on-background-medium text-sm">
                  <code className="text-xs">as</code> clause
                </p>
              </div>
            }
            name="behavior"
            options={[
              {
                id: "permissive",
                label: "Permissive",
                value: "permissive",
                description: 'Policies are combined using the "OR" Boolean operator',
              },
              {
                id: "restrictive",
                label: "Restrictive",
                value: "restrictive",
                description: 'Policies are combined using the "AND" Boolean operator',
              },
            ]}
          />

          {/* <FormField
                        control={form.control}
                        name="behavior"
                        render={({ field }) => (
                            <FormItem className="col-span-6 flex flex-col gap-y-1">
                                <FormLabel className="flex items-center gap-x-4">
                                    <p className="neutral-on-background-medium text-sm">Policy Behavior</p>
                                    <p className="neutral-on-background-medium text-sm">
                                        <code className="text-xs">as</code> clause
                                    </p>
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        disabled={isEditing}
                                        value={field.value}
                                        onValueChange={(value) => form.setFieldValue('behavior', value)}
                                    >
                                        <SelectTrigger className="text-sm h-10 capitalize">
                                            {field.value}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="permissive" className="text-sm">
                                                    <p>Permissive</p>
                                                    <p className="neutral-on-background-medium text-xs">
                                                        Policies are combined using the "OR" Boolean operator
                                                    </p>
                                                </SelectItem>
                                                <SelectItem value="restrictive" className="text-sm">
                                                    <p>Restrictive</p>
                                                    <p className="neutral-on-background-medium text-xs">
                                                        Policies are combined using the "AND" Boolean operator
                                                    </p>
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

          <FieldWrapper
            label={
              <div className="flex items-center gap-x-4">
                <p className="neutral-on-background-medium text-sm">Policy Command</p>
                <p className="neutral-on-background-medium text-sm">
                  <code className="text-xs">for</code> clause
                </p>
              </div>
            }
            name="command"
          >
            <RadioGroup
              disabled={isEditing}
              value={form.values["command"]}
              defaultValue={form.values["command"]}
              onValueChange={(value) => {
                form.setFieldValue("command", value);
                onUpdateCommand(value);
              }}
              className={`grid grid-cols-10 gap-3 ${isEditing ? "opacity-50" : ""}`}
            >
              {[
                "select",
                "insert",
                ...(authContext === "database" ? ["update", "delete", "all"] : []),
              ].map((x) => (
                <RadioGroupItem
                  key={x}
                  value={x}
                  disabled={isEditing}
                  // label={x.toLocaleUpperCase()}
                  className={`col-span-2 w-auto ${isEditing ? "cursor-not-allowed" : ""}`}
                />
              ))}
            </RadioGroup>
          </FieldWrapper>

          <InputSelectField
            label={
              <div className="flex items-center gap-x-4">
                <p className="neutral-on-background-medium text-sm">Target Roles</p>
                <p className="neutral-on-background-medium text-sm">
                  <code className="text-xs">to</code> clause
                </p>
              </div>
            }
            name="roles"
            // options={formattedRoles}
            // value={form.values.roles.length === 0 ? [] : form.values.roles?.split(', ')}
            placeholder="Defaults to all (public) roles if none selected"
            // searchPlaceholder="Search for a role"
            searchable
            // onValueChange={(roles: string[]) => form.setFieldValue('roles', roles.join(', '))}
            multiple
            options={formattedRoles.map((role) => ({
              label: role.name,
              value: role.value,
              disabled: role.disabled,
            }))}
            portal={false}
          />
          {/*                     
                    <FormField
                        control={form.control}
                        name="roles"
                        render={({ field }) => (
                            <FormItem className="col-span-12 flex flex-col gap-y-1">
                                <FormLabel className="flex items-center gap-x-4">
                                    <p className="neutral-on-background-medium text-sm">Target Roles</p>
                                    <p className="neutral-on-background-medium text-sm">
                                        <code className="text-xs">to</code> clause
                                    </p>
                                </FormLabel>
                                <FormControl>
                                    <MultiSelectV2
                                        disabled={!canUpdatePolicies}
                                        options={formattedRoles}
                                        value={field.value.length === 0 ? [] : field.value?.split(', ')}
                                        placeholder="Defaults to all (public) roles if none selected"
                                        searchPlaceholder="Search for a role"
                                        onChange={(roles) => form.setFieldValue('roles', roles.join(', '))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}
        </div>
      </div>
    </>
  );
};
