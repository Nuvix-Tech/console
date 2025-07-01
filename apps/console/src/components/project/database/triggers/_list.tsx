import type { PostgresTrigger } from "@nuvix/pg-meta";
import { includes, noop, partition, sortBy } from "lodash";
import { Check, Edit, Edit2, MoreVertical, Search, Trash, X } from "lucide-react";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { DataGridProvider, Table } from "@/ui/data-grid";
import { useDatabaseTriggersQuery } from "@/data/database-triggers/database-triggers-query";
import { useSchemasQuery } from "@/data/database/schemas-query";
import { useTablesQuery } from "@/data/tables/tables-query";
import {
  Badge,
} from "@nuvix/sui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@nuvix/sui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@nuvix/sui/components/tooltip";
import { useProjectStore } from "@/lib/store";
import { Button } from "@nuvix/ui/components";
import { Input } from "@chakra-ui/react";
import { SkeletonText } from "@nuvix/cui/skeleton";
import { EmptyState } from "@/components/_empty_state";
import { PROTECTED_SCHEMAS } from "@/lib/constants/schemas";
import SchemaSelector from "@/ui/SchemaSelector";
import { InputGroup } from "@nuvix/cui/input-group";
import ProtectedSchemaWarning from "@/ui/ProtectedSchemaWarning";
import AlertError from "@/components/others/ui/alert-error";
import { CreateButton } from "@/components/others";
import { generateTriggerCreateSQL } from "./_utils";

interface TriggersListProps {
  createTrigger: () => void;
  editTrigger: (trigger: PostgresTrigger) => void;
  deleteTrigger: (trigger: PostgresTrigger) => void;
}

const TriggersList = ({
  createTrigger = noop,
  editTrigger = noop,
  deleteTrigger = noop,
}: TriggersListProps) => {
  const { project: selectedProject, sdk } = useProjectStore((s) => s);
  const [selectedSchema, setSelectedSchema] = useState<string>("public");
  const [filterString, setFilterString] = useState<string>("");

  const canCreateTriggers = true; // useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'triggers')

  const { data: schemas } = useSchemasQuery({
    projectRef: selectedProject.$id,
    sdk,
  });

  const [protectedSchemas] = partition(schemas ?? [], (schema) =>
    PROTECTED_SCHEMAS.includes(schema?.name ?? ""),
  );
  const foundSchema = schemas?.find((schema) => schema.name === selectedSchema);
  const isLocked = protectedSchemas.some((s) => s.id === foundSchema?.id);

  const { data = [], isSuccess } = useTablesQuery({
    projectRef: selectedProject.$id,
    sdk,
  });
  const hasTables = data.filter((a) => !PROTECTED_SCHEMAS.includes(a.schema)).length > 0;

  const {
    data: triggers,
    error,
    isLoading,
    isFetching,
    isError,
  } = useDatabaseTriggersQuery({
    projectRef: selectedProject.$id,
    sdk,
  });

  const filteredTriggers = (triggers ?? []).filter((x: any) =>
    includes(x.name.toLowerCase(), filterString.toLowerCase()),
  );
  const _triggers = sortBy(
    filteredTriggers.filter((x: any) => x.schema == selectedSchema),
    (trigger) => trigger.name.toLocaleLowerCase(),
  );

  const hasQuery = !!filterString;

  const tableColumns: ColumnDef<(typeof _triggers)[number]>[] = [
    {
      header: "Name",
      accessorKey: "name",
      minSize: 180,
      cell({ getValue, row }) {
        const name = getValue<string>();
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="tertiary"
                size="s"
                onClick={() => editTrigger(row.original)}
                className="truncate max-w-48"
              >
                {name}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              {name}
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      header: "Table",
      accessorKey: "table",
      minSize: 150,
      cell({ getValue }) {
        const table = getValue<string>();
        return (
          <p title={table} className="truncate">
            {table}
          </p>
        );
      },
    },
    {
      header: "Function",
      accessorKey: "function_name",
      minSize: 150,
      cell({ getValue }) {
        const functionName = getValue<string>();
        return (
          <p title={functionName} className="truncate">
            {functionName}
          </p>
        );
      },
    },
    {
      header: "Events",
      accessorKey: "events",
      minSize: 200,
      cell({ getValue, row }) {
        const events = getValue<string[]>();
        const activation = row.original.activation;
        return (
          <div className="flex gap-2 flex-wrap">
            {events.map((event: string) => (
              <Badge key={event}>{`${activation} ${event}`}</Badge>
            ))}
          </div>
        );
      },
    },
    {
      header: "Orientation",
      accessorKey: "orientation",
      minSize: 120,
      cell({ getValue }) {
        const orientation = getValue<string>();
        return (
          <p title={orientation} className="truncate">
            {orientation}
          </p>
        );
      },
    },
    {
      header: "Enabled",
      accessorKey: "enabled_mode",
      minSize: 80,
      cell({ getValue }) {
        const enabledMode = getValue<string>();
        return (
          <div className="flex items-center justify-center">
            {enabledMode !== "DISABLED" ? (
              <Check strokeWidth={2} className="text-brand" />
            ) : (
              <X strokeWidth={2} />
            )}
          </div>
        );
      },
    },
    {
      header: "",
      accessorKey: "actions",
      minSize: 60,
      cell({ row }) {
        const trigger = row.original;
        return (
          <div className="flex justify-end">
            {!isLocked && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="s" className="px-1">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="w-52">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem
                        disabled={!canCreateTriggers}
                        onClick={() => {
                          const x = generateTriggerCreateSQL(trigger);
                          editTrigger(x as any);
                        }}
                        className="space-x-2 !pointer-events-auto"
                      >
                        <Edit2 size={14} />
                        <p>Edit trigger</p>
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    {!canCreateTriggers && (
                      <TooltipContent side="bottom">
                        Additional permissions required to edit trigger
                      </TooltipContent>
                    )}
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem
                        disabled={!canCreateTriggers}
                        onClick={() => {
                          // AI assistant functionality would go here
                        }}
                        className="space-x-2 !pointer-events-auto"
                      >
                        <Edit size={14} />
                        <p>Edit with Assistant</p>
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    {!canCreateTriggers && (
                      <TooltipContent side="bottom">
                        Additional permissions required to edit trigger
                      </TooltipContent>
                    )}
                  </Tooltip>

                  <DropdownMenuSeparator />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem
                        disabled={!canCreateTriggers}
                        onClick={() => deleteTrigger(trigger)}
                        className="space-x-2 !pointer-events-auto"
                      >
                        <Trash size={14} className="text-destructive" />
                        <p>Delete trigger</p>
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    {!canCreateTriggers && (
                      <TooltipContent side="bottom">
                        Additional permissions required to delete trigger
                      </TooltipContent>
                    )}
                  </Tooltip>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) return <SkeletonText noOfLines={4} />;
  if (isError) return <AlertError error={error} subject="Failed to retrieve database triggers" />;

  const create = (
    <CreateButton
      hasPermission={canCreateTriggers && !isLocked && hasTables}
      onClick={() => createTrigger()}
      size="s"
      tooltip={
        !hasTables
          ? "Create a table first before creating triggers"
          : !canCreateTriggers
            ? "You need additional permissions to create triggers"
            : undefined
      }
    >
      Create a new trigger
    </CreateButton>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 flex-wrap">
        <div className="flex flex-col lg:flex-row lg:items-center gap-2">
          <SchemaSelector
            className="w-full lg:w-[180px]"
            size="s"
            showError={false}
            selectedSchemaName={selectedSchema}
            onSelectSchema={(schema) => {
              setFilterString("");
              setSelectedSchema(schema);
            }}
          />
          <InputGroup startElement={<Search size={14} />} className="w-full lg:w-52">
            <Input
              placeholder="Search for a trigger"
              size="xs"
              value={filterString}
              onChange={(e) => setFilterString(e.target.value)}
            />
          </InputGroup>
        </div>

        <div className="flex items-center gap-x-2">{!isLocked && create}</div>
      </div>

      {isLocked && <ProtectedSchemaWarning schema={selectedSchema} entity="triggers" />}

      <DataGridProvider<(typeof _triggers)[number]>
        columns={tableColumns}
        data={_triggers}
        loading={isFetching}
      >
        <EmptyState
          show={_triggers.length === 0 && !isFetching && !hasQuery && !isLoading}
          title="No triggers created yet"
          description={`There are no triggers found in the schema "${selectedSchema}"`}
          primaryComponent={create}
        >
          {/* <p className="text-sm text-muted-foreground">
                        A PostgreSQL trigger is a function invoked automatically whenever an event associated
                        with a table occurs.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        An event could be any of the following: INSERT, UPDATE, DELETE. A trigger is a special
                        user-defined function associated with a table.
                    </p> */}
        </EmptyState>

        {(_triggers.length > 0 || hasQuery) && (
          <Table noResults={_triggers.length === 0 && hasQuery} />
        )}
      </DataGridProvider>
    </div>
  );
};

export default TriggersList;
