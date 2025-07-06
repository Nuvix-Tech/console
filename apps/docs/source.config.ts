import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export default defineConfig({
  mdxOptions: {},
});

export const docs = defineDocs({
  dir: ["content/docs", "src/content/docs", "apps/docs/src/content/docs"],
  docs: {},
});
