/**
 * A list of system schemas that users should not interact with
 */
export const PROTECTED_SCHEMAS = [
  "auth",
  "core",
  "extensions",
  "information_schema",
  "net",
  "realtime",
  "system",
  "vault",
];

export const PROTECTED_SCHEMAS_WITHOUT_EXTENSIONS = PROTECTED_SCHEMAS.filter(
  (x) => x !== "extensions",
);
