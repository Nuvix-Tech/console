import { partition, sortBy } from "lodash";
import { AlertCircle, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";

import { DataGridProvider, Table } from "@/ui/data-grid";
import { useDatabaseIndexDeleteMutation } from "@/data/database-indexes/index-delete-mutation";
import { useIndexesQuery } from "@/data/database-indexes/indexes-query";
import { useSchemasQuery } from "@/data/database/schemas-query";
import { useProjectStore } from "@/lib/store";
import { Button, IconButton } from "@nuvix/ui/components";
import { Code, Input } from "@chakra-ui/react";
import { SkeletonText } from "@nuvix/cui/skeleton";
import { EmptyState } from "@/components/_empty_state";
import { PROTECTED_SCHEMAS } from "@/lib/constants/schemas";
import SchemaSelector from "@/ui/SchemaSelector";
import { InputGroup } from "@nuvix/cui/input-group";
import ProtectedSchemaWarning from "@/ui/ProtectedSchemaWarning";
import AlertError from "@/components/others/ui/alert-error";
import { CreateButton } from "@/components/others";
import CreateIndexSidePanel from "./_create";
import { CodeEditor } from "@/ui/CodeEditor";
import ConfirmationModal from "@/components/editor/components/_confim_dialog";
import { Sheet, SheetClose, SheetContent, SheetHeader } from "@nuvix/sui/components/sheet";

type DatabaseIndex = any;

const Indexes = () => {
  const { project: selectedProject, sdk } = useProjectStore((s) => s);

  const [search, setSearch] = useState("");
  const [selectedSchema, setSelectedSchema] = useState<string>("public");
  const [showCreateIndex, setShowCreateIndex] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<DatabaseIndex>();
  const [selectedIndexToDelete, setSelectedIndexToDelete] = useState<DatabaseIndex>();

  const {
    data: allIndexes,
    error: indexesError,
    isLoading: isLoadingIndexes,
    isError: isErrorIndexes,
  } = useIndexesQuery({
    schema: selectedSchema,
    projectRef: selectedProject.$id,
    sdk,
  });

  const {
    data: schemas,
    isLoading: isLoadingSchemas,
    isError: isErrorSchemas,
  } = useSchemasQuery({
    projectRef: selectedProject.$id,
    sdk,
  });

  const { mutate: deleteIndex, isPending: isExecuting } = useDatabaseIndexDeleteMutation({
    onSuccess: async () => {
      setSelectedIndexToDelete(undefined);
      toast.success("Successfully deleted index");
    },
  });

  const [protectedSchemas] = partition(schemas ?? [], (schema) =>
    PROTECTED_SCHEMAS.includes(schema?.name ?? ""),
  );
  const schema = schemas?.find((schema) => schema.name === selectedSchema);
  const isLocked = protectedSchemas.some((s) => s.id === schema?.id);

  const sortedIndexes = sortBy(allIndexes ?? [], (index) => index.name.toLocaleLowerCase());
  const indexes =
    search.length > 0
      ? sortedIndexes.filter((index) => index.name.includes(search) || index.table.includes(search))
      : sortedIndexes;

  const onConfirmDeleteIndex = (index: DatabaseIndex) => {
    if (!selectedProject) return console.error("Project is required");

    deleteIndex({
      projectRef: selectedProject.$id,
      sdk,
      name: index.name,
    });
  };

  const tableColumns: ColumnDef<DatabaseIndex>[] = [
    {
      header: "Schema",
      accessorKey: "schema",
      minSize: 120,
      cell({ getValue }) {
        const schema = getValue<string>();
        return <p title={schema}>{schema}</p>;
      },
    },
    {
      header: "Table",
      accessorKey: "table",
      minSize: 150,
      cell({ getValue }) {
        const table = getValue<string>();
        return <p title={table}>{table}</p>;
      },
    },
    {
      header: "Name",
      accessorKey: "name",
      minSize: 200,
      cell({ getValue }) {
        const name = getValue<string>();
        return <p title={name}>{name}</p>;
      },
    },
    {
      header: "",
      accessorKey: "actions",
      minSize: 200,
      cell({ row }) {
        const index = row.original;
        return (
          <div className="flex justify-end items-center space-x-2">
            <Button variant="secondary" size="s" onClick={() => setSelectedIndex(index)}>
              View definition
            </Button>
            {!isLocked && (
              <IconButton
                icon={<Trash size={14} />}
                variant="tertiary"
                size="s"
                className="px-1"
                onClick={() => setSelectedIndexToDelete(index)}
              />
            )}
          </div>
        );
      },
    },
  ];

  if (isLoadingIndexes) return <SkeletonText noOfLines={4} />;
  if (isErrorIndexes)
    return <AlertError error={indexesError} subject="Failed to retrieve database indexes" />;

  const create = (
    <CreateButton hasPermission={!isLocked} onClick={() => setShowCreateIndex(true)} size="s">
      Create index
    </CreateButton>
  );

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 flex-wrap">
          <div className="flex flex-col lg:flex-row lg:items-center gap-2">
            {isLoadingSchemas && <SkeletonText className="w-[260px]" />}
            {isErrorSchemas && (
              <div className="w-[260px] text-muted-foreground text-sm border px-3 py-1.5 rounded flex items-center space-x-2">
                <AlertCircle strokeWidth={2} size={16} />
                <p>Failed to load schemas</p>
              </div>
            )}
            {!isLoadingSchemas && !isErrorSchemas && (
              <SchemaSelector
                className="w-full lg:w-[180px]"
                size="s"
                showError={false}
                selectedSchemaName={selectedSchema}
                onSelectSchema={setSelectedSchema}
              />
            )}
            <InputGroup startElement={<Search size={14} />} className="w-full lg:w-52">
              <Input
                placeholder="Search for an index"
                size="xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </div>

          <div className="flex items-center gap-x-2">{!isLocked && create}</div>
        </div>

        {isLocked && <ProtectedSchemaWarning schema={selectedSchema} entity="indexes" />}

        <DataGridProvider<DatabaseIndex>
          columns={tableColumns}
          data={indexes}
          loading={isLoadingIndexes}
        >
          <EmptyState
            show={sortedIndexes.length === 0 && !isLoadingIndexes && search.length === 0}
            title="No indexes created yet"
            description={`There are no indexes found in the schema "${selectedSchema}"`}
            primaryComponent={create}
          />

          {(indexes.length > 0 || search.length > 0) && (
            <Table noResults={indexes.length === 0 && search.length > 0} interactive={false} />
          )}
        </DataGridProvider>
      </div>

      <Sheet
        open={selectedIndex !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedIndex(undefined);
          }
        }}
      >
        <SheetContent className="gap-0">
          <SheetHeader className="flex flex-row items-center gap-2 !py-5">
            <span>Index:</span> <Code className="text-sm w-auto">{selectedIndex?.name}</Code>
          </SheetHeader>
          <SheetClose />
          <div className="h-full">
            <CodeEditor
              isReadOnly
              id={selectedIndex?.name ?? ""}
              language="pgsql"
              defaultValue={selectedIndex?.definition ?? ""}
            />
          </div>
        </SheetContent>
      </Sheet>

      <CreateIndexSidePanel visible={showCreateIndex} onClose={() => setShowCreateIndex(false)} />

      <ConfirmationModal
        variant="warning"
        // size="medium"
        loading={isExecuting}
        visible={selectedIndexToDelete !== undefined}
        title={
          <>
            Confirm to delete index <Code className="text-sm">{selectedIndexToDelete?.name}</Code>
          </>
        }
        confirmLabel="Confirm delete"
        confirmLabelLoading="Deleting..."
        onConfirm={() =>
          selectedIndexToDelete !== undefined ? onConfirmDeleteIndex(selectedIndexToDelete) : {}
        }
        onCancel={() => setSelectedIndexToDelete(undefined)}
        alert={{
          title: "This action cannot be undone",
          description:
            "Deleting an index that is still in use will cause queries to slow down, and in some cases causing significant performance issues.",
        }}
      >
        <ul className="mt-4 space-y-5">
          <li className="flex gap-3">
            <div>
              <strong className="text-sm">Before deleting this index, consider:</strong>
              <ul className="space-y-2 mt-2 text-sm text-muted-foreground">
                <li className="list-disc ml-6">This index is no longer in use</li>
                <li className="list-disc ml-6">
                  The table which the index is on is not currently in use, as dropping an index
                  requires a short exclusive access lock on the table.
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </ConfirmationModal>
    </>
  );
};

export default Indexes;
