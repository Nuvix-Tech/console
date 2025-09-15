import type { PostgresPolicy } from "@nuvix/pg-meta";
import { noop } from "lodash";

import { useDatabasePoliciesQuery } from "@/data/database-policies/database-policies-query";
// import { useTableRolesAccessQuery } from '@/data/tables/table-roles-access-query';
// import ShimmeringLoader from 'ui-patterns/ShimmeringLoader';
import { Table, TableHeader, TableBody, TableHead, TableRow } from "@nuvix/sui/components/table";
import { PolicyRow } from "./PolicyRow";
import { PolicyTableRowHeader } from "./PolicyTableRowHeader";
import { useProjectStore } from "@/lib/store";
import { Card, CardContent, CardHeader } from "@nuvix/sui/components/card";
import { cn } from "@nuvix/sui/lib/utils";
import { Alert, AlertDescription } from "@nuvix/sui/components/alert";
import AlertError from "@/components/others/ui/alert-error";

export interface PolicyTableRowProps {
  table: {
    id: number;
    schema: string;
    name: string;
    rls_enabled: boolean;
  };
  isLocked: boolean;
  onSelectToggleRLS: (table: {
    id: number;
    schema: string;
    name: string;
    rls_enabled: boolean;
  }) => void;
  onSelectCreatePolicy: () => void;
  onSelectEditPolicy: (policy: PostgresPolicy) => void;
  onSelectDeletePolicy: (policy: PostgresPolicy) => void;
}

export const PolicyTableRow = ({
  table,
  isLocked,
  onSelectToggleRLS = noop,
  onSelectCreatePolicy,
  onSelectEditPolicy = noop,
  onSelectDeletePolicy = noop,
}: PolicyTableRowProps) => {
  const { project, sdk } = useProjectStore();

  // [Joshen] Changes here are so that warnings are more accurate and granular instead of purely relying if RLS is disabled or enabled
  // The following scenarios are technically okay if the table has RLS disabled, in which it won't be publicly readable / writable
  // - If the schema is not exposed through the API via Postgrest
  // - If the anon and authenticated roles do not have access to the table
  // Ideally we should just rely on the security lints as the source of truth, but the security lints currently have limitations
  // - They only consider the public schema
  // - They do not consider roles
  // Eventually if the security lints are able to cover those, we can look to using them as the source of truth instead then
  // const { data: config } = useProjectPostgrestConfigQuery({ projectRef: project?.$id });
  // const exposedSchemas = config?.db_schema ? config?.db_schema.replace(/ /g, '').split(',') : [];
  const isRLSEnabled = table.rls_enabled;
  const isTableExposedThroughAPI = true; //  exposedSchemas.includes(table.schema);

  const roles: any[] = ["anon", "authenticated"];
  // const { data: roles = [] } = useTableRolesAccessQuery({
  //   projectRef: project?.$id,
  //   sdk,
  //   schema: table.schema,
  //   table: table.name,
  // });
  const hasAnonAuthenticatedRolesAccess = roles.length !== 0;
  const isPubliclyReadableWritable =
    !isRLSEnabled && isTableExposedThroughAPI && hasAnonAuthenticatedRolesAccess;

  const { data, error, isLoading, isError, isSuccess } = useDatabasePoliciesQuery({
    projectRef: project?.$id,
    sdk,
  });
  const policies = (data ?? [])
    .filter((policy: any) => policy.schema === table.schema && policy.table === table.name)
    .sort((a: any, b: any) => a.name.localeCompare(b.name));
  const rlsEnabledNoPolicies = isRLSEnabled && policies.length === 0;
  const isRealtimeSchema = table.schema === "realtime";
  const isRealtimeMessagesTable = isRealtimeSchema && table.name === "messages";
  const isTableLocked = isRealtimeSchema ? !isRealtimeMessagesTable : isLocked;

  return (
    <Card
      className={cn(
        "p-0 gap-0 rounded-xs surface-background shadow-none surface-border",
        isPubliclyReadableWritable && "warning-border-medium",
      )}
    >
      <CardHeader
        className={cn(
          "py-3 px-4 border-b",
          (isPubliclyReadableWritable || rlsEnabledNoPolicies) && "border-b-0",
        )}
      >
        <PolicyTableRowHeader
          table={table}
          isLocked={isLocked}
          onSelectToggleRLS={onSelectToggleRLS}
          onSelectCreatePolicy={onSelectCreatePolicy}
        />
      </CardHeader>

      {(isPubliclyReadableWritable || rlsEnabledNoPolicies) && (
        <Alert
          className="border-0 rounded-none mb-0 border-b border-t warning-border-medium"
          variant={isPubliclyReadableWritable ? "warning" : "default"}
        >
          <AlertDescription>
            {isPubliclyReadableWritable
              ? "Anyone can read, modify, or delete your data."
              : "No data will be selectable via Nuvix APIs because RLS is enabled but no policies have been created yet."}
          </AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <CardContent>
          {/* <ShimmeringLoader /> */}
          <p>Loading...</p>
        </CardContent>
      )}

      {isError && (
        <CardContent className="p-0">
          <AlertError
            className="border-0 rounded-none"
            error={error}
            subject="Failed to retrieve policies"
          />
        </CardContent>
      )}

      {isSuccess && (
        <CardContent className="p-0">
          {policies.length === 0 ? (
            <p className="neutral-on-background-weak text-sm p-4">No policies created yet</p>
          ) : (
            <Table className="table-fixed px-8">
              <TableHeader className="uppercase text-xs">
                <TableRow>
                  <TableHead className="w-[40%]">Name</TableHead>
                  <TableHead className="w-[20%]">Command</TableHead>
                  <TableHead className="w-[30%]">Applied to</TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy: any) => (
                  <PolicyRow
                    key={policy.id}
                    policy={policy}
                    isLocked={isTableLocked}
                    onSelectEditPolicy={onSelectEditPolicy}
                    onSelectDeletePolicy={onSelectDeletePolicy}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      )}
    </Card>
  );
};
