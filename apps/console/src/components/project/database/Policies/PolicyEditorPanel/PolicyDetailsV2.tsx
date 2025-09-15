import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
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
import { PopoverContent, PopoverTrigger, Popover } from "@nuvix/sui/components/popover";
import { RadioGroup, RadioGroupLargeItem } from "@nuvix/sui/components/radio-group";
import { useProjectStore } from "@/lib/store";
import { useCheckPermission } from "@/hooks/useCheckPermissions";
import { PermissionAction } from "@/types";
import { useFormikContext } from "formik";
import type { PolicyFormValues } from ".";
import { FieldWrapper, InputField, InputSelectField } from "@/components/others/forms";
import { Button, Input } from "@nuvix/ui/components";
import { ScrollArea } from "@nuvix/sui/components/scroll-area";

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
  }, [isEditing, searchString, tables, isSuccessTables, selectedTable]);

  return (
    <>
      <div className="px-5 py-5 flex flex-col gap-y-4 border-b">
        <div className="items-start justify-between gap-4 grid grid-cols-12">
          <InputField
            label="Policy Name"
            name="name"
            height="s"
            placeholder="Provide a name for your policy"
            disabled={!canUpdatePolicies}
            className="col-span-6"
          />

          <FieldWrapper
            label={
              <div className="flex items-center gap-x-4">
                <p className="text-sm">Table</p>
                <p className="neutral-on-background-medium text-sm">
                  <code className="text-xs">on</code> clause
                </p>
              </div>
            }
            className="col-span-6 gap-1"
            name="table"
          >
            {authContext === "database" ? (
              <Popover open={open} onOpenChange={setOpen} modal={false}>
                <PopoverTrigger asChild>
                  <Button
                    type="default"
                    size="s"
                    variant="secondary"
                    fillWidth
                    justifyContent="space-between"
                    disabled={!canUpdatePolicies}
                    className="w-full !h-[38px] text-sm"
                    suffixIcon={
                      <ChevronsUpDown className="text-foreground-muted" strokeWidth={2} size={14} />
                    }
                  >
                    <div className="w-full flex gap-1">
                      <span className="text-foreground">
                        {schema}.{form.values.table}
                      </span>
                    </div>
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0" side="bottom" align="start">
                  <Command>
                    <CommandInput placeholder="Find a table..." />
                    <CommandList>
                      <CommandEmpty>No tables found</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className={(tables ?? []).length > 7 ? "h-[200px]" : ""}>
                          {(tables ?? []).map((table) => (
                            <CommandItem
                              key={table.id}
                              className="cursor-pointer flex items-center justify-between space-x-2 w-full"
                              onSelect={() => {
                                form.setFieldValue("table", table.name);
                                setOpen(false);
                              }}
                              onClick={() => {
                                form.setFieldValue("table", table.name);
                                setOpen(false);
                              }}
                            >
                              <span className="flex items-center gap-1.5">
                                {form.values.table === table.name ? <Check size={13} /> : ""}
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
            ) : authContext === "realtime" ? (
              <Input disabled value="messages.realtime" className="bg-control border-control" />
            ) : null}
          </FieldWrapper>

          <InputSelectField
            portal={false}
            height="s"
            label={
              <div className="flex items-center gap-x-4">
                <p className="text-sm">Policy Behavior</p>
                <p className="neutral-on-background-medium text-sm">
                  <code className="text-xs">as</code> clause
                </p>
              </div>
            }
            className="col-span-6"
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

          <FieldWrapper
            className="col-span-12 flex flex-col gap-y-1"
            label={
              <div className="flex items-center gap-x-4">
                <p className="text-sm">Policy Command</p>
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
              className={`grid grid-cols-5 gap-3 ${isEditing ? "opacity-50" : ""}`}
            >
              {[
                "select",
                "insert",
                ...(authContext === "database" ? ["update", "delete", "all"] : []),
              ].map((x) => (
                <RadioGroupLargeItem
                  key={x}
                  value={x}
                  disabled={isEditing}
                  label={x.toLocaleUpperCase()}
                  className={`col-span-2 w-auto ${isEditing ? "cursor-not-allowed" : ""}`}
                />
              ))}
            </RadioGroup>
          </FieldWrapper>

          <InputSelectField
            label={
              <div className="flex items-center gap-x-4">
                <p className="text-sm">Target Roles</p>
                <p className="neutral-on-background-medium text-sm">
                  <code className="text-xs">to</code> clause
                </p>
              </div>
            }
            height="s"
            className="col-span-12 flex flex-col gap-y-1"
            name="roles"
            placeholder="Defaults to all (public) roles if none selected"
            searchable
            multiple
            options={formattedRoles.map((role) => ({
              label: role.name,
              value: role.value,
              disabled: role.disabled,
            }))}
            portal={false}
          />
        </div>
      </div>
    </>
  );
};
