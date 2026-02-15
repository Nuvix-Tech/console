"use client";
import type { PostgresPolicy, PostgresTable } from "@nuvix/pg-meta";
import { useState } from "react";

// import { useIsInlineEditorEnabled } from 'components/interfaces/App/FeaturePreview/FeaturePreviewContext'
// import { EditorPanel } from 'components/ui/EditorPanel/EditorPanel'
// import NoPermission from 'components/ui/NoPermission'
import { useDatabasePoliciesQuery } from "@/data/database-policies/database-policies-query";
import { useTablesQuery } from "@/data/tables/tables-query";
import { useSearchQuery } from "@/hooks/useQuery";
import { useProjectStore } from "@/lib/store";
import { useIsProtectedSchema } from "@/hooks/useProtectedSchemas";
import { useCheckPermission } from "@/hooks/useCheckPermissions";
import { PermissionAction } from "@/types";
import { PageContainer, PageHeading } from "@/components/others";
import { DocsButton } from "@/ui/DocsButton";
import { getGeneralPolicyTemplates } from "./PolicyEditorModal/PolicyEditorModal.constants";
import { generatePolicyUpdateSQL } from "./PolicyTableRow/PolicyTableRow.utils";
import { PolicyEditorPanel } from "./PolicyEditorPanel";
import { Policies } from "./Policies";
import AlertError from "@/components/others/ui/alert-error";
import SchemaSelector from "@/ui/SchemaSelector";
import { GenericSkeletonLoader } from "@/components/editor/components/GenericSkeleton";
import { Input } from "@nuvix/ui/components";
import { Search } from "@/ui/data-grid";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
// import { useAsyncCheckProjectPermissions } from 'hooks/misc/useCheckPermissions'
// import { useSelectedProjectQuery } from 'hooks/misc/useSelectedProject'
// import { useUrlState } from 'hooks/ui/useUrlState'
// import { useIsProtectedSchema } from 'hooks/useProtectedSchemas'

/**
 * Filter tables by table name and policy name
 *
 * @param tables list of table
 * @param policies list of policy
 * @param searchString filter keywords
 *
 * @returns list of table
 */
const onFilterTables = (
  tables: PostgresTable[],
  policies: PostgresPolicy[],
  searchString?: string,
) => {
  if (!searchString) {
    return tables
      .slice()
      .sort((a: PostgresTable, b: PostgresTable) => a.name.localeCompare(b.name));
  } else {
    const filter = searchString.toLowerCase();
    const findSearchString = (s: string) => s.toLowerCase().includes(filter);
    // @ts-ignore Type instantiation is excessively deep and possibly infinite
    const filteredPolicies = policies.filter((p: PostgresPolicy) => findSearchString(p.name));

    return tables
      .slice()
      .filter((x: PostgresTable) => {
        return (
          x.name.toLowerCase().includes(filter) ||
          x.id.toString() === filter ||
          filteredPolicies.some((p: PostgresPolicy) => p.table === x.name)
        );
      })
      .sort((a: PostgresTable, b: PostgresTable) => a.name.localeCompare(b.name));
  }
};

export const AuthPoliciesPage = () => {
  const { params, setQueryParam } = useSearchQuery();
  const { selectedSchema, setSelectedSchema } = useQuerySchemaState();
  const schema = selectedSchema || "public";
  const searchString = params.get("search") || "";
  const setParams = (newParams: { search?: string }) => {
    setQueryParam("search", newParams.search);
  };
  const { project, sdk } = useProjectStore();
  const isInlineEditorEnabled = false; // useIsInlineEditorEnabled();

  const [selectedTable, setSelectedTable] = useState<string>();
  const [showPolicyAiEditor, setShowPolicyAiEditor] = useState(false);
  const [selectedPolicyToEdit, setSelectedPolicyToEdit] = useState<PostgresPolicy>();

  // Local editor panel state
  const [editorPanelOpen, setEditorPanelOpen] = useState(false);

  const { isSchemaLocked } = useIsProtectedSchema({
    schema: schema,
    excludedSchemas: ["realtime"],
  });

  const { data: policies } = useDatabasePoliciesQuery({
    projectRef: project?.$id,
    sdk,
  });

  const {
    data: tables,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useTablesQuery({
    projectRef: project?.$id,
    sdk,
    schema: schema,
  });

  const filteredTables = onFilterTables(tables ?? [], policies ?? [], searchString);
  const { can: canReadPolicies, isSuccess: isPermissionsLoaded } = useCheckPermission(
    PermissionAction.TENANT_SQL_ADMIN_READ,
    "policies",
  );

  if (isPermissionsLoaded && !canReadPolicies) {
    // return <NoPermission isFullPage resourceText="view this project's RLS policies" />;
    ("No permission $$EDIT$$ ");
  }

  return (
    <PageContainer>
      <PageHeading
        heading="Policies"
        description="Manage Row Level Security policies for your tables"
        right={
          <DocsButton href="https://supabase.com/docs/learn/auth-deep-dive/auth-row-level-security" />
        }
      />

      <div className="mb-4 flex flex-row gap-2 justify-between">
        <Search
          placeholder="Filter tables and policies"
          inputClass="!h-8 !min-h-8 max-w-64"
          value={searchString || ""}
          onChange={(e) => {
            const str = e.target.value;
            setParams({ ...params, search: str === "" ? undefined : str });
          }}
        />

        <SchemaSelector
          className="w-full lg:w-[180px]"
          showError={false}
          selectedSchemaName={schema}
          onSelectSchema={(schema) => {
            setSelectedSchema(schema);
            setParams({ ...params, search: undefined });
          }}
        />
      </div>

      {isLoading && <GenericSkeletonLoader />}

      {isError && <AlertError error={error} subject="Failed to retrieve tables" />}

      {isSuccess && (
        <Policies
          search={searchString}
          schema={schema}
          tables={filteredTables}
          hasTables={tables.length > 0}
          isLocked={isSchemaLocked}
          onSelectCreatePolicy={(table: string) => {
            setSelectedTable(table);
            setSelectedPolicyToEdit(undefined);
            if (isInlineEditorEnabled) {
              setEditorPanelOpen(true);
            } else {
              setShowPolicyAiEditor(true);
            }
          }}
          onSelectEditPolicy={(policy) => {
            setSelectedPolicyToEdit(policy);
            setSelectedTable(undefined);
            if (isInlineEditorEnabled) {
              setEditorPanelOpen(true);
            } else {
              setShowPolicyAiEditor(true);
            }
          }}
          onResetSearch={() => setParams({ ...params, search: undefined })}
        />
      )}

      <PolicyEditorPanel
        visible={showPolicyAiEditor}
        schema={schema}
        searchString={searchString}
        selectedTable={selectedTable}
        selectedPolicy={selectedPolicyToEdit}
        onSelectCancel={() => {
          setSelectedTable(undefined);
          setShowPolicyAiEditor(false);
          setSelectedPolicyToEdit(undefined);
        }}
        authContext="database"
      />

      {/* <EditorPanel
                open={editorPanelOpen}
                onClose={() => {
                    setEditorPanelOpen(false);
                    setSelectedPolicyToEdit(undefined);
                    setSelectedTable(undefined);
                }}
                onRunSuccess={() => {
                    setEditorPanelOpen(false);
                    setSelectedPolicyToEdit(undefined);
                    setSelectedTable(undefined);
                }}
                initialValue={
                    selectedPolicyToEdit
                        ? generatePolicyUpdateSQL(selectedPolicyToEdit)
                        : selectedTable
                            ? `create policy "replace_with_policy_name"\n  on ${schema}.${selectedTable}\n  for select\n  to authenticated\n  using (\n    true  -- Write your policy condition here\n);`
                            : ''
                }
                label={
                    selectedPolicyToEdit
                        ? 'RLS policies are just SQL statements that you can alter'
                        : selectedTable
                            ? `Create new RLS policy on "${selectedTable}"`
                            : ''
                }
                initialPrompt={
                    selectedPolicyToEdit
                        ? `Update the policy with name "${selectedPolicyToEdit.name}" in the ${selectedPolicyToEdit.schema} schema on the ${selectedPolicyToEdit.table} table. It should...`
                        : selectedTable
                            ? `Create and name a entirely new RLS policy for the "${selectedTable}" table in the ${schema} schema. The policy should...`
                            : ''
                }
                templates={
                    selectedPolicyToEdit
                        ? getGeneralPolicyTemplates(
                            selectedPolicyToEdit.schema,
                            selectedPolicyToEdit.table
                        ).map((template) => ({
                            name: template.templateName,
                            description: template.description,
                            content: template.statement,
                        }))
                        : []
                }
            /> */}
    </PageContainer>
  );
};
