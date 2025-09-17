import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProjectSdk } from "@/lib/sdk";
import { executeSql } from "../sql/execute-sql-query";
import { databasePoliciesKeys } from "./keys";

const TLP_PREFIX = "nx_table";
const RLP_PREFIX = "nx_row";

interface SecurityMutationVariables {
  projectRef: string;
  sdk: ProjectSdk;
  id: number;
  schema: string;
  table: string;
  enableTable?: boolean;
  enableRow?: boolean;
}

export async function mutateSecurityFn({
  projectRef,
  sdk,
  id,
  schema,
  table,
  enableTable,
  enableRow,
}: SecurityMutationVariables) {
  const fqtn = `${schema}.${table}`;
  const statements: string[] = [];

  // ---- Table-level policies ----
  if (enableTable === true) {
    statements.push(`select system.apply_table_policies('${fqtn}')`);
  } else if (enableTable === false) {
    statements.push(`
      drop policy if exists ${TLP_PREFIX}_read on ${fqtn};
      drop policy if exists ${TLP_PREFIX}_create on ${fqtn};
      drop policy if exists ${TLP_PREFIX}_update on ${fqtn};
      drop policy if exists ${TLP_PREFIX}_delete on ${fqtn}
    `);
  }

  // ---- Row-level policies ----
  if (enableRow === true) {
    statements.push(`select system.apply_row_policies('${fqtn}')`);
  } else if (enableRow === false) {
    statements.push(`
      drop policy if exists ${RLP_PREFIX}_read on ${fqtn};
      drop policy if exists ${RLP_PREFIX}_create on ${fqtn};
      drop policy if exists ${RLP_PREFIX}_update on ${fqtn};
      drop policy if exists ${RLP_PREFIX}_delete on ${fqtn}
    `);
    // After disabling row-level → fallback to table-level
    statements.push(`select system.apply_table_policies('${fqtn}')`);
  }

  const sql = `
    begin;
    ${statements.join(";\n")};
    commit;
  `;

  return executeSql({
    projectRef,
    sdk,
    sql,
    queryKey: ["mutate-security", id],
  });
}

export function useMutateSecurity(projectRef: string, schema: string, id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: Omit<SecurityMutationVariables, "projectRef" | "schema" | "id">) =>
      mutateSecurityFn({ projectRef, schema, id, ...vars }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...databasePoliciesKeys.list(projectRef, schema), { id }],
      });
    },
  });
}
