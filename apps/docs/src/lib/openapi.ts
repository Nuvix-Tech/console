import { createOpenAPI } from "fumadocs-openapi/server";
import specs from "../../public/specs/open-api.json";
import { OpenAPIV3, OpenAPIV3_1 } from "openapi-types";

export const openapi = createOpenAPI({
  input: () => ({ content: specs }) as Record<string, OpenAPIV3.Document | OpenAPIV3_1.Document>,
});
