import { Edit, MoreVertical, Search, Trash } from "lucide-react";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { DataGridProvider, Table } from "@/ui/data-grid";
import {
  EnumeratedType,
  useEnumeratedTypesQuery,
} from "@/data/enumerated-types/enumerated-types-query";
import { useSchemasQuery } from "@/data/database/schemas-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nuvix/sui/components";
import { useProjectStore } from "@/lib/store";
import { Button, IconButton } from "@nuvix/ui/components";
import { Input } from "@chakra-ui/react";
import { SkeletonText } from "@/components/cui/skeleton";
import { EmptyState } from "@/components/_empty_state";
import { PROTECTED_SCHEMAS } from "@/lib/constants/schemas";
import SchemaSelector from "@/ui/SchemaSelector";
import { InputGroup } from "@/components/cui/input-group";
import ProtectedSchemaWarning from "@/ui/ProtectedSchemaWarning";
import AlertError from "@/components/others/ui/alert-error";
import { CreateButton } from "@/components/others";
import { DocsButton } from "@/ui/DocsButton";
import CreateEnumeratedTypeSidePanel from "./_create";
import DeleteEnumeratedTypeModal from "./_delete";
import EditEnumeratedTypeSidePanel from "./_edit";

interface EnumeratedTypesProps {
  createType?: () => void;
  editType?: (type: EnumeratedType) => void;
  deleteType?: (type: EnumeratedType) => void;
}

const EnumeratedTypes = ({ createType, editType, deleteType }: EnumeratedTypesProps) => {
  const { project: selectedProject, sdk } = useProjectStore((s) => s);
  const [selectedSchema, setSelectedSchema] = useState<string>("public");
  const [filterString, setFilterString] = useState<string>("");
  const [showCreateTypePanel, setShowCreateTypePanel] = useState(false);
  const [selectedTypeToEdit, setSelectedTypeToEdit] = useState<EnumeratedType>();
  const [selectedTypeToDelete, setSelectedTypeToDelete] = useState<EnumeratedType>();

  const canCreateTypes = true; // Add your permission check here

  const { data: schemas } = useSchemasQuery({
    projectRef: selectedProject.$id,
    sdk,
  });

  const protectedSchemas = (schemas ?? []).filter((schema) =>
    PROTECTED_SCHEMAS.includes(schema?.name ?? ""),
  );
  const foundSchema = schemas?.find((schema) => schema.name === selectedSchema);
  const isLocked = protectedSchemas.some((s) => s.id === foundSchema?.id);

  const { data, error, isLoading, isFetching, isError } = useEnumeratedTypesQuery({
    projectRef: selectedProject.$id,
    sdk,
  });

  const enumeratedTypes = (data ?? []).filter((type: any) => type.enums.length > 0);
  const filteredEnumeratedTypes = enumeratedTypes
    .filter((x: any) => x.schema === selectedSchema)
    .filter(
      (x: any) =>
        filterString.length === 0 || x.name.toLowerCase().includes(filterString.toLowerCase()),
    );

  const hasQuery = !!filterString;

  const tableColumns: ColumnDef<EnumeratedType>[] = [
    {
      header: "Schema",
      accessorKey: "schema",
      minSize: 120,
      cell({ getValue }) {
        return (
          <p className="w-20 truncate" title={getValue<string>()}>
            {getValue<string>()}
          </p>
        );
      },
    },
    {
      header: "Name",
      accessorKey: "name",
      minSize: 180,
      cell({ getValue }) {
        return <p>{getValue<string>()}</p>;
      },
    },
    {
      header: "Values",
      accessorKey: "enums",
      minSize: 300,
      cell({ getValue }) {
        const enums = getValue<string[]>();
        return <p>{enums.join(", ")}</p>;
      },
    },
    {
      header: "",
      accessorKey: "actions",
      minSize: 60,
      cell({ row }) {
        const type = row.original;
        return (
          <div className="flex justify-end">
            {!isLocked && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton variant="tertiary" size="s" className="px-1">
                    <MoreVertical size={20} />
                  </IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="w-40">
                  <DropdownMenuItem
                    className="space-x-2"
                    onClick={() => {
                      setSelectedTypeToEdit(type);
                      editType?.(type);
                    }}
                  >
                    <Edit size={14} />
                    <p>Update type</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="space-x-2"
                    onClick={() => {
                      setSelectedTypeToDelete(type);
                      deleteType?.(type);
                    }}
                  >
                    <Trash size={14} />
                    <p>Delete type</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) return <SkeletonText noOfLines={4} />;
  if (isError)
    return <AlertError error={error} subject="Failed to retrieve database enumerated types" />;

  const create = (
    <CreateButton
      hasPermission={canCreateTypes && !isLocked}
      onClick={() => {
        setShowCreateTypePanel(true);
        createType?.();
      }}
      size="s"
      tooltip={
        !canCreateTypes ? "You need additional permissions to create enumerated types" : undefined
      }
    >
      Create type
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
              placeholder="Search for a type"
              size="xs"
              value={filterString}
              onChange={(e) => setFilterString(e.target.value)}
            />
          </InputGroup>
        </div>

        <div className="flex items-center gap-x-2">
          <DocsButton href="https://www.postgresql.org/docs/current/datatype-enum.html" />
          {!isLocked && create}
        </div>
      </div>

      {isLocked && <ProtectedSchemaWarning schema={selectedSchema} entity="enumerated types" />}

      <DataGridProvider<EnumeratedType>
        columns={tableColumns}
        data={filteredEnumeratedTypes}
        loading={isFetching}
      >
        <EmptyState
          show={filteredEnumeratedTypes.length === 0 && !isFetching && !hasQuery && !isLoading}
          title="No enumerated types created yet"
          description={`There are no enumerated types found in the schema "${selectedSchema}"`}
          primaryComponent={create}
        />

        {(filteredEnumeratedTypes.length > 0 || hasQuery) && (
          <Table noResults={filteredEnumeratedTypes.length === 0 && hasQuery} />
        )}
      </DataGridProvider>

      <CreateEnumeratedTypeSidePanel
        visible={showCreateTypePanel}
        onClose={() => setShowCreateTypePanel(false)}
        schema={selectedSchema}
      />

      <EditEnumeratedTypeSidePanel
        visible={selectedTypeToEdit !== undefined}
        selectedEnumeratedType={selectedTypeToEdit}
        onClose={() => setSelectedTypeToEdit(undefined)}
      />

      <DeleteEnumeratedTypeModal
        visible={selectedTypeToDelete !== undefined}
        selectedEnumeratedType={selectedTypeToDelete}
        onClose={() => setSelectedTypeToDelete(undefined)}
      />
    </div>
  );
};

export default EnumeratedTypes;
