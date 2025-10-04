import { generateFiles } from "fumadocs-openapi";
import { openapi, openapi2 } from "@/lib/openapi";

void generateFiles({
  input: openapi,
  output: "./src/content/docs/api/server",
  // we recommend to enable it
  // make sure your endpoint description doesn't break MDX syntax.
  includeDescription: true,
});

void generateFiles({
  input: openapi2,
  output: "./src/content/docs/api/platform",
  // we recommend to enable it
  // make sure your endpoint description doesn't break MDX syntax.
  includeDescription: true,
});
