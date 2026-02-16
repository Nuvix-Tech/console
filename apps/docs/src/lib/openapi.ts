import { createOpenAPI } from "fumadocs-openapi/server";

export const openapi = createOpenAPI({
  input: ["https://api.nuvix.in/api-yaml"],
});
