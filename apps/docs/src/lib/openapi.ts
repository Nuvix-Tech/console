import { createOpenAPI } from "fumadocs-openapi/server";

export const openapi = createOpenAPI({
  input: ["public/specs/server/open-api.json"],
});

export const openapi2 = createOpenAPI({
  input: ["public/specs/platform/open-api.json"],
});

export const openapi3 = createOpenAPI({
  // the OpenAPI schema, you can also give it an external URL.
  input: ["public/specs/server/open-api.json", "public/specs/platform/open-api.json"],
});
