export const IS_PLATFORM = process.env.NEXT_PUBLIC_IS_PLATFORM === "true";

export const API_URL = (() => {
  //  If running in platform, use API_URL from the env var
  if (IS_PLATFORM) return process.env.NEXT_PUBLIC_API_URL!;
  // If running in browser, let it add the host
  if (typeof window !== "undefined") return "/api";
  // If running self-hosted Vercel preview, use VERCEL_URL
  if (!!process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api`;
  // If running on self-hosted, use NEXT_PUBLIC_SITE_URL
  if (!!process.env.NEXT_PUBLIC_SITE_URL) return `${process.env.NEXT_PUBLIC_SITE_URL}/api`;
  return "/api";
})();

export const PG_META_URL = IS_PLATFORM
  ? process.env.PLATFORM_PG_META_URL
  : process.env.STUDIO_PG_META_URL;
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * @deprecated use DATETIME_FORMAT
 */
export const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ssZ";

// should be used for all dayjs formattings shown to the user. Includes timezone info.
export const DATETIME_FORMAT = "DD MMM YYYY, HH:mm:ss (ZZ)";

export const GOTRUE_ERRORS = {
  UNVERIFIED_GITHUB_USER: "Error sending confirmation mail",
};

export const STRIPE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "pk_test_XVwg5IZH3I9Gti98hZw6KRzd00v5858heG";

export const USAGE_APPROACHING_THRESHOLD = 0.75;

export const LOCAL_STORAGE_KEYS = {
  AI_ASSISTANT_STATE: (projectRef: string | undefined) => `nuvix-ai-assistant-state-${projectRef}`,
  SIDEBAR_BEHAVIOR: "   -sidebar-behavior",
  EDITOR_PANEL_STATE: "nuvix-editor-panel-state",

  UI_PREVIEW_API_SIDE_PANEL: "nuvix-ui-api-side-panel",
  UI_PREVIEW_CLS: "nuvix-ui-cls",
  UI_PREVIEW_INLINE_EDITOR: "nuvix-ui-preview-inline-editor",
  UI_ONBOARDING_NEW_PAGE_SHOWN: "nuvix-ui-onboarding-new-page-shown",
  UI_TABLE_EDITOR_TABS: "nuvix-ui-table-editor-tabs",
  UI_SQL_EDITOR_TABS: "nuvix-ui-sql-editor-tabs",
  UI_NEW_LAYOUT_PREVIEW: "nuvix-ui-new-layout-preview",
  NEW_LAYOUT_NOTICE_ACKNOWLEDGED: "new-layout-notice-acknowledge",

  DASHBOARD_HISTORY: (ref: string) => `dashboard-history-${ref}`,
  STORAGE_PREFERENCE: (ref: string) => `storage-explorer-${ref}`,

  SQL_EDITOR_INTELLISENSE: "nuvix_sql-editor-intellisense-enabled",
  SQL_EDITOR_SPLIT_SIZE: "nuvix_sql-editor-split-size",
  // Key to track which schemas are ok to be sent to AI. The project ref is intentionally put at the end for easier search in the browser console.
  SQL_EDITOR_AI_SCHEMA: (ref: string) => `nuvix_sql-editor-ai-schema-enabled-${ref}`,
  SQL_EDITOR_AI_OPEN: "nuvix_sql-editor-ai-open",
  SQL_EDITOR_LAST_SELECTED_DB: (ref: string) => `sql-editor-last-selected-db-${ref}`,
  SQL_EDITOR_SQL_BLOCK_ACKNOWLEDGED: (ref: string) => `sql-editor-sql-block-acknowledged-${ref}`,
  SQL_EDITOR_SECTION_STATE: (ref: string) => `sql-editor-section-state-${ref}`,
  SQL_EDITOR_SORT: (ref: string) => `sql-editor-sort-${ref}`,

  LOG_EXPLORER_SPLIT_SIZE: "nuvix_log-explorer-split-size",
  GRAPHIQL_RLS_BYPASS_WARNING: "graphiql-rls-bypass-warning-dismissed",
  CLS_DIFF_WARNING: "cls-diff-warning-dismissed",
  CLS_SELECT_STAR_WARNING: "cls-select-star-warning-dismissed",
  QUERY_PERF_SHOW_BOTTOM_SECTION: "nuvix-query-perf-show-bottom-section",
  // Key to track account deletion requests
  ACCOUNT_DELETION_REQUEST: "nuvix-account-deletion-request",
  // Used for storing a user id when sending reports to Sentry. The id is hashed for anonymity.
  SENTRY_USER_ID: "nuvix-sentry-user-id",
  // Used for storing the last sign in method used by the user
  LAST_SIGN_IN_METHOD: "nuvix-last-sign-in-method",
  // Key to track the last selected schema. The project ref is intentionally put at the end for easier search in the browser console.
  LAST_SELECTED_SCHEMA: (ref: string) => `last-selected-schema-${ref}`,
  // Track position of nodes for schema visualizer
  SCHEMA_VISUALIZER_POSITIONS: (ref: string, schemaId: number) =>
    `schema-visualizer-positions-${ref}-${schemaId}`,
  // Used for allowing the main nav panel to expand on hover
  EXPAND_NAVIGATION_PANEL: "nuvix-expand-navigation-panel",
  GITHUB_AUTHORIZATION_STATE: "nuvix-github-authorization-state",
  // Notice banner keys
  FLY_POSTGRES_DEPRECATION_WARNING: "fly-postgres-deprecation-warning-dismissed",
  AUTH_USERS_COLUMNS_CONFIGURATION: (ref: string) => `nuvix-auth-users-columns-${ref}`,

  // api keys view switcher for new and legacy api keys
  API_KEYS_VIEW: (ref: string) => `nuvix-api-keys-view-${ref}`,

  // last visited logs page
  LAST_VISITED_LOGS_PAGE: "nuvix-last-visited-logs-page",
  LAST_VISITED_ORGANIZATION: "last-visited-organization",
};

export const OPT_IN_TAGS = {
  AI_SQL: "AI_SQL_GENERATOR_OPT_IN",
};

export const GB = 1024 * 1024 * 1024;
export const MB = 1024 * 1024;
export const KB = 1024;

export * from "./cookies";
