import type { PostgresFunction } from "@nuvix/pg-meta";
import { includes, noop, partition, sortBy } from "lodash";
import { Edit, Edit2, FileText, MoreVertical, Search, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { DataGridProvider, Table } from "@/ui/data-grid";
import { useDatabaseFunctionsQuery } from "@/data/database-functions/database-functions-query";
import { useSchemasQuery } from "@/data/database/schemas-query";
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
import { Code, Input } from "@chakra-ui/react";
import { SkeletonText } from "@nuvix/cui/skeleton";
import { EmptyState } from "@/components/_empty_state";
import { PROTECTED_SCHEMAS } from "@/lib/constants/schemas";
import SchemaSelector from "@/ui/SchemaSelector";
import { InputGroup } from "@nuvix/cui/input-group";
import ProtectedSchemaWarning from "@/ui/ProtectedSchemaWarning";
import AlertError from "@/components/others/ui/alert-error";
import { CreateButton } from "@/components/others";

interface FunctionsListProps {
  createFunction: () => void;
  editFunction: (fn: PostgresFunction) => void;
  deleteFunction: (fn: PostgresFunction) => void;
}

const FunctionsList = ({
  createFunction = noop,
  editFunction = noop,
  deleteFunction = noop,
}: FunctionsListProps) => {
  const router = useRouter();
  const { project: selectedProject, sdk } = useProjectStore((s) => s);
  // const aiSnap = useAiAssistantStateSnapshot()
  const [selectedSchema, setSelectedSchema] = useState<string>("public");
  const [filterString, setFilterString] = useState<string>("");

  const canCreateFunctions = true; // useCheckPermissions(
  //     PermissionAction.TENANT_SQL_ADMIN_WRITE,
  //     'functions'
  // )

  const { data: schemas } = useSchemasQuery({
    projectRef: selectedProject.$id,
    sdk,
  });

  const [protectedSchemas] = partition(schemas ?? [], (schema) =>
    PROTECTED_SCHEMAS.includes(schema?.name ?? ""),
  );
  const foundSchema = schemas?.find((schema) => schema.name === selectedSchema);
  const isLocked = protectedSchemas.some((s) => s.id === foundSchema?.id);

  const {
    data: functions,
    error,
    isLoading,
    isFetching,
    isError,
  } = useDatabaseFunctionsQuery({
    projectRef: selectedProject.$id,
    sdk,
  });

  const filteredFunctions = (functions ?? []).filter((x) =>
    includes(x.name.toLowerCase(), filterString.toLowerCase()),
  );
  const _functions = sortBy(
    filteredFunctions.filter((x) => x.schema == selectedSchema),
    (func) => func.name.toLocaleLowerCase(),
  );

  const projectRef = selectedProject.$id;
  const hasQuery = !!filterString;

  const tableColumns: ColumnDef<(typeof _functions)[number]>[] = [
    {
      header: "Name",
      accessorKey: "name",
      minSize: 180,
      cell({ getValue, row }) {
        const name = getValue<string>();
        return (
          <Button
            tooltip={name}
            variant="tertiary"
            size="s"
            onClick={() => editFunction(row.original)}
            className="text-elipsis"
          >
            {name}
          </Button>
        );
      },
    },
    {
      header: "Arguments",
      accessorKey: "argument_types",
      minSize: 200,
      cell({ getValue }) {
        const argumentTypes = getValue<string>();
        return (
          <p title={argumentTypes} className="truncate">
            {argumentTypes || "-"}
          </p>
        );
      },
    },
    {
      header: "Return Type",
      accessorKey: "return_type",
      minSize: 120,
      cell({ getValue }) {
        return (
          <Code title={getValue<string>()} className="text-xs">
            {getValue<string>()}
          </Code>
        );
      },
    },
    {
      header: "Security",
      accessorKey: "security_definer",
      minSize: 120,
      cell({ getValue }) {
        return <p>{getValue<boolean>() ? "Definer" : "Invoker"}</p>;
      },
    },
    {
      header: "",
      accessorKey: "actions",
      minSize: 60,
      cell({ row }) {
        const func = row.original;
        const isApiDocumentAvailable = selectedSchema == "public" && func.return_type !== "trigger";

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
                  {isApiDocumentAvailable && (
                    <DropdownMenuItem
                      className="space-x-2"
                      onClick={() => router.push(`/project/${projectRef}/api?rpc=${func.name}`)}
                    >
                      <FileText size={14} />
                      <p>Client API docs</p>
                    </DropdownMenuItem>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem
                        disabled={!canCreateFunctions}
                        onClick={() => editFunction(func)}
                        className="space-x-2 !pointer-events-auto"
                      >
                        <Edit2 size={14} />
                        <p>Edit function</p>
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    {!canCreateFunctions && (
                      <TooltipContent side="bottom">
                        Additional permissions required to edit function
                      </TooltipContent>
                    )}
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem
                        disabled={!canCreateFunctions}
                        onClick={() => {
                          // aiSnap.newChat({
                          //     name: `Update function ${func.name}`,
                          //     open: true,
                          //     initialInput: 'Update this function to do...',
                          //     suggestions: {
                          //         title:
                          //             'I can help you make a change to this function, here are a few example prompts to get you started:',
                          //         prompts: [
                          //             'Rename this function to ...',
                          //             'Modify this function so that it ...',
                          //             'Add a trigger for this function that calls it when ...',
                          //         ],
                          //     },
                          //     sqlSnippets: [func.complete_statement],
                          // })
                        }}
                        className="space-x-2 !pointer-events-auto"
                      >
                        <Edit size={14} />
                        <p>Edit function with Assistant</p>
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    {!canCreateFunctions && (
                      <TooltipContent side="bottom">
                        Additional permissions required to edit function
                      </TooltipContent>
                    )}
                  </Tooltip>

                  <DropdownMenuSeparator />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem
                        disabled={!canCreateFunctions}
                        onClick={() => deleteFunction(func)}
                        className="space-x-2 !pointer-events-auto"
                      >
                        <Trash size={14} className="text-destructive" />
                        <p>Delete function</p>
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    {!canCreateFunctions && (
                      <TooltipContent side="bottom">
                        Additional permissions required to delete function
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
  if (isError) return <AlertError error={error} subject="Failed to retrieve database functions" />;

  const create = (
    <CreateButton
      hasPermission={canCreateFunctions && !isLocked}
      onClick={() => createFunction()}
      size="s"
      tooltip={
        !canCreateFunctions ? "You need additional permissions to create functions" : undefined
      }
    >
      Create a new function
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
              placeholder="Search for a function"
              size="xs"
              value={filterString}
              onChange={(e) => setFilterString(e.target.value)}
            />
          </InputGroup>
        </div>

        <div className="flex items-center gap-x-2">
          {!isLocked && (
            <>
              {create}
              {/* <Button
                                        type="default"
                                        disabled={!canCreateFunctions}
                                        className="px-1 pointer-events-auto"
                                        icon={<AiIconAnimation size={16} />}
                                        onClick={() =>
                                            aiSnap.newChat({
                                                name: 'Create new function',
                                                open: true,
                                                initialInput: `Create a new function for the schema ${selectedSchema} that does ...`,
                                            })
                                        }
                                        tooltip={{
                                            content: {
                                                side: 'bottom',
                                                text: !canCreateFunctions
                                                    ? 'You need additional permissions to create functions'
                                                    : 'Create with Supabase Assistant',
                                            },
                                        }}
                                    /> */}
            </>
          )}
        </div>
      </div>

      {isLocked && <ProtectedSchemaWarning schema={selectedSchema} entity="functions" />}

      <DataGridProvider<(typeof _functions)[number]>
        columns={tableColumns}
        data={_functions}
        loading={isFetching}
      >
        <EmptyState
          show={_functions.length === 0 && !isFetching && !hasQuery && !isLoading}
          title="No functions created yet"
          description={`There are no functions found in the schema "${selectedSchema}"`}
          primaryComponent={create}
        >
          {/* <p className="text-sm text-muted-foreground">
            Functions are a powerful way to encapsulate logic and can be used to create reusable
            database operations.
          </p>
          <p className="text-sm text-muted-foreground">
            It's stored on the database server and can be invoked using the SQL interface.
          </p> */}
        </EmptyState>

        {(_functions.length > 0 || hasQuery) && (
          <Table noResults={_functions.length === 0 && hasQuery} interactive={false} />
        )}
      </DataGridProvider>
    </div>
  );
};

export default FunctionsList;
