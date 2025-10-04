// .source folder will be generated when you run `next dev`
import { docs } from "@/../.source";
import { loader } from "fumadocs-core/source";
import { openapiPlugin } from "fumadocs-openapi/server";

export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
  // @ts-ignore
  plugins: [openapiPlugin()],
});
