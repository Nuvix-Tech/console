type PostgrestImpersonationRole =
  | {
      type: "postgrest";
      role: "anon";
    }
  | {
      type: "postgrest";
      role: "service_role";
    }
  | {
      type: "postgrest";
      role: "authenticated";
      userType: "native";
      user?: any;
      aal?: "aal1" | "aal2";
    }
  | {
      type: "postgrest";
      role: "authenticated";
      userType: "external";
      externalAuth?: {
        sub: string;
        additionalClaims?: Record<string, any>;
      };
      aal?: "aal1" | "aal2";
    };

export type PostgrestRole = PostgrestImpersonationRole["role"];

export type CustomImpersonationRole = {
  type: "custom";
  role: string;
};

export type ImpersonationRole = PostgrestImpersonationRole | CustomImpersonationRole;

function getExp1HourFromNow() {
  return Math.floor((Date.now() + 60 * 60 * 1000) / 1000);
}

function getPostgrestRoleImpersonationSql(role: PostgrestImpersonationRole, claims: any) {
  const unexpiredClaims = { ...claims, exp: getExp1HourFromNow() };

  return `
    select set_config('role', '${role.role}', true),
           set_config('request.jwt.claims', '${JSON.stringify(unexpiredClaims).replaceAll("'", "''")}', true),
           set_config('request.method', 'POST', true),
           set_config('request.path', '/impersonation-example-request-path', true),
           set_config('request.headers', '{"accept": "*/*"}', true);
  `.trim();
}

// Includes getPostgrestRoleImpersonationSql() and wrapWithRoleImpersonation()
export const ROLE_IMPERSONATION_SQL_LINE_COUNT = 11;
export const ROLE_IMPERSONATION_NO_RESULTS = "ROLE_IMPERSONATION_NO_RESULTS";

function getCustomRoleImpersonationSql(roleName: string) {
  return /* SQL */ `
    set local role '${roleName}';
  `;
}

export type RoleImpersonationState = any; // Pick<ValtioRoleImpersonationState, "role" | "claims">;

export function wrapWithRoleImpersonation(sql: string, state?: RoleImpersonationState) {
  const { role, claims } = state ?? { role: undefined, claims: undefined };

  if (role === undefined) {
    return sql;
  }

  const impersonationSql =
    role.type === "postgrest"
      ? claims !== undefined
        ? getPostgrestRoleImpersonationSql(role, claims)
        : ""
      : getCustomRoleImpersonationSql(role.role);

  return /* SQL */ `
    ${impersonationSql}

    -- If the users sql returns no rows, pg-meta will
    -- fallback to returning the result of the impersonation sql.
    select 1 as "${ROLE_IMPERSONATION_NO_RESULTS}";

    ${sql}
  `;
}
