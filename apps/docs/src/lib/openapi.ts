import { createOpenAPI } from "fumadocs-openapi/server";
import specs from "../content/openapi.bundle.json";
import { OpenAPIV3, OpenAPIV3_1 } from "openapi-types";

export const openapi = createOpenAPI({
  input: () =>
    ({ content: specs }) as unknown as Record<string, OpenAPIV3.Document | OpenAPIV3_1.Document>,
});
