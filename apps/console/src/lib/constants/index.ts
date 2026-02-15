export const IS_PLATFORM = process.env.NEXT_PUBLIC_IS_PLATFORM === "true";
export const isPlatform = IS_PLATFORM;
export const APP_NAME = "Nuvix";
export const APP_NAME_SMALL = "Nuvix";
export const API_ENDPOINT = process.env.NEXT_PUBLIC_NUVIX_ENDPOINT ?? "https://api.nuvix.in/v1";
export const SHOW_TABLE_BORDER = process.env.NEXT_PUBLIC_TABLE_BORDER === "true";
export const NUVIX_INERNAL_API_URL =
  process.env.NEXT_PUBLIC_NUVIX_INTERNAL_API_URL ?? "https://server.nuvix.in";

// export const API_URL = (() => {
//   //  If running in platform, use API_URL from the env var
//   if (IS_PLATFORM) return process.env.NEXT_PUBLIC_API_URL!;
//   // If running in browser, let it add the host
//   if (typeof window !== "undefined") return "/api";
//   // If running self-hosted Vercel preview, use VERCEL_URL
//   if (!!process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api`;
//   // If running on self-hosted, use NEXT_PUBLIC_SITE_URL
//   if (!!process.env.NEXT_PUBLIC_SITE_URL) return `${process.env.NEXT_PUBLIC_SITE_URL}/api`;
//   return "/api";
// })();

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
  LAST_SELECTED_SCHEMA: (ref: string, type?: "doc") =>
    `last-selected-${type ? type + "_" : ""}schema-${ref}`,
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
export * from "./schemas";

export const PLATFORM_URL = process.env.NEXT_PUBLIC_PLATFORM_URL || "https://server.nuvix.in";

export const scopes = [
  { scope: "account", description: "Access to your account", category: "Auth" },

  // Sessions
  { scope: "sessions.create", description: "Access to create user sessions", category: "Auth" },
  { scope: "sessions.update", description: "Access to update user sessions", category: "Auth" },
  { scope: "sessions.delete", description: "Access to delete user sessions", category: "Auth" },

  // Users
  { scope: "users.read", description: "Access to read your project's users", category: "Auth" },
  { scope: "users.create", description: "Access to create your project's users", category: "Auth" },
  { scope: "users.update", description: "Access to update your project's users", category: "Auth" },
  { scope: "users.delete", description: "Access to delete your project's users", category: "Auth" },

  // Teams
  { scope: "teams.read", description: "Access to read your project's teams", category: "Auth" },
  { scope: "teams.create", description: "Access to create your project's teams", category: "Auth" },
  { scope: "teams.update", description: "Access to update your project's teams", category: "Auth" },
  { scope: "teams.delete", description: "Access to delete your project's teams", category: "Auth" },

  // Collections
  {
    scope: "collections.read",
    description: "Access to read your project's database collections",
    category: "Database",
  },
  {
    scope: "collections.create",
    description: "Access to create your project's database collections",
    category: "Database",
  },
  {
    scope: "collections.update",
    description: "Access to update your project's database collections",
    category: "Database",
  },
  {
    scope: "collections.delete",
    description: "Access to delete your project's database collections",
    category: "Database",
  },

  // Attributes
  {
    scope: "attributes.read",
    description: "Access to read your project's database collection's attributes",
    category: "Database",
  },
  {
    scope: "attributes.create",
    description: "Access to create your project's database collection's attributes",
    category: "Database",
  },
  {
    scope: "attributes.update",
    description: "Access to update your project's database collection's attributes",
    category: "Database",
  },
  {
    scope: "attributes.delete",
    description: "Access to delete your project's database collection's attributes",
    category: "Database",
  },

  // Indexes
  {
    scope: "indexes.read",
    description: "Access to read your project's database collection's indexes",
    category: "Database",
  },
  {
    scope: "indexes.create",
    description: "Access to create your project's database collection's indexes",
    category: "Database",
  },
  {
    scope: "indexes.update",
    description: "Access to update your project's database collection's indexes",
    category: "Database",
  },
  {
    scope: "indexes.delete",
    description: "Access to delete your project's database collection's indexes",
    category: "Database",
  },

  // Documents
  {
    scope: "documents.read",
    description: "Access to read your project's database documents",
    category: "Database",
  },
  {
    scope: "documents.create",
    description: "Access to create your project's database documents",
    category: "Database",
  },
  {
    scope: "documents.update",
    description: "Access to update your project's database documents",
    category: "Database",
  },
  {
    scope: "documents.delete",
    description: "Access to delete your project's database documents",
    category: "Database",
  },

  // Files
  {
    scope: "files.read",
    description: "Access to read your project's storage files and preview images",
    category: "Storage",
  },
  {
    scope: "files.create",
    description: "Access to create your project's storage files",
    category: "Storage",
  },
  {
    scope: "files.update",
    description: "Access to update your project's storage files",
    category: "Storage",
  },
  {
    scope: "files.delete",
    description: "Access to delete your project's storage files",
    category: "Storage",
  },

  // Buckets
  {
    scope: "buckets.read",
    description: "Access to read your project's storage buckets",
    category: "Storage",
  },
  {
    scope: "buckets.create",
    description: "Access to create your project's storage buckets",
    category: "Storage",
  },
  {
    scope: "buckets.update",
    description: "Access to update your project's storage buckets",
    category: "Storage",
  },
  {
    scope: "buckets.delete",
    description: "Access to delete your project's storage buckets",
    category: "Storage",
  },

  // Functions
  // {
  //   scope: "functions.read",
  //   description: "Access to read your project's functions and code deployments",
  //   category: "Functions",
  // },
  // {
  //   scope: "functions.create",
  //   description: "Access to create your project's functions and code deployments",
  //   category: "Functions",
  // },
  // {
  //   scope: "functions.update",
  //   description: "Access to update your project's functions and code deployments",
  //   category: "Functions",
  // },
  // {
  //   scope: "functions.delete",
  //   description: "Access to delete your project's functions and code deployments",
  //   category: "Functions",
  // },

  // {
  //   scope: "execution.read",
  //   description: "Access to read your project's execution logs",
  //   category: "Functions",
  // },
  // {
  //   scope: "execution.create",
  //   description: "Access to execute your project's functions",
  //   category: "Functions",
  // },

  // Messaging
  {
    scope: "targets.read",
    description: "Access to read your project's targets",
    category: "Messaging",
  },
  {
    scope: "targets.create",
    description: "Access to create your project's targets",
    category: "Messaging",
  },
  {
    scope: "targets.update",
    description: "Access to update your project's targets",
    category: "Messaging",
  },
  {
    scope: "targets.delete",
    description: "Access to delete your project's targets",
    category: "Messaging",
  },

  {
    scope: "providers.read",
    description: "Access to read your project's providers",
    category: "Messaging",
  },
  {
    scope: "providers.create",
    description: "Access to create your project's providers",
    category: "Messaging",
  },
  {
    scope: "providers.update",
    description: "Access to update your project's providers",
    category: "Messaging",
  },
  {
    scope: "providers.delete",
    description: "Access to delete your project's providers",
    category: "Messaging",
  },

  {
    scope: "messages.read",
    description: "Access to read your project's messages",
    category: "Messaging",
  },
  {
    scope: "messages.create",
    description: "Access to create your project's messages",
    category: "Messaging",
  },
  {
    scope: "messages.update",
    description: "Access to update your project's messages",
    category: "Messaging",
  },
  {
    scope: "messages.delete",
    description: "Access to delete your project's messages",
    category: "Messaging",
  },

  {
    scope: "topics.read",
    description: "Access to read your project's topics",
    category: "Messaging",
  },
  {
    scope: "topics.create",
    description: "Access to create your project's topics",
    category: "Messaging",
  },
  {
    scope: "topics.update",
    description: "Access to update your project's topics",
    category: "Messaging",
  },
  {
    scope: "topics.delete",
    description: "Access to delete your project's topics",
    category: "Messaging",
  },

  {
    scope: "subscribers.read",
    description: "Access to read your project's subscribers",
    category: "Messaging",
  },
  {
    scope: "subscribers.create",
    description: "Access to create your project's subscribers",
    category: "Messaging",
  },
  {
    scope: "subscribers.update",
    description: "Access to update your project's subscribers",
    category: "Messaging",
  },
  {
    scope: "subscribers.delete",
    description: "Access to delete your project's subscribers",
    category: "Messaging",
  },

  // Other
  {
    scope: "locale.read",
    description: "Access to access your project's Locale service",
    category: "Other",
  },
  {
    scope: "avatars.read",
    description: "Access to access your project's Avatars service",
    category: "Other",
  },
  {
    scope: "health.read",
    description: "Access to read your project's health status",
    category: "Other",
  },

  // Schema
  { scope: "schemas.create", description: "Access to create a schema", category: "Database" },
  { scope: "schemas.update", description: "Access to update a schema", category: "Database" },
  { scope: "schemas.delete", description: "Access to delete a schema", category: "Database" },
  { scope: "schemas.read", description: "Access to read a schema", category: "Database" },
  {
    scope: "schemas.tables.read",
    description: "Access to read a schema tables",
    category: "Database",
  },
  {
    scope: "schemas.tables.create",
    description: "Access to create a schema tables",
    category: "Database",
  },
  {
    scope: "schemas.tables.update",
    description: "Access to update a schema tables",
    category: "Database",
  },
  {
    scope: "schemas.tables.delete",
    description: "Access to delete a schema tables",
    category: "Database",
  },
];
