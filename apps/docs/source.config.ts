import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      addLanguageClass: true,
    } as any,
  },
});

export const docs = defineDocs({
  dir: ["content/docs", "src/content/docs", "apps/docs/src/content/docs"],
  docs: {},
});
