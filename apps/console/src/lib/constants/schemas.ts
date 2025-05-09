/**
 * A list of system schemas that users should not interact with
 */
export const PROTECTED_SCHEMAS = [
  "auth",
  "extensions",
  "information_schema",
  "net",
  "realtime",
  "storage",
  "system",
  "functions",
  "messaging",
];

export const PROTECTED_SCHEMAS_WITHOUT_EXTENSIONS = PROTECTED_SCHEMAS.filter(
  (x) => x !== "extensions",
);
