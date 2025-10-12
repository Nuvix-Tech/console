import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";
import { z } from "zod";

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      addLanguageClass: true,
    } as any,
  },
});

export const docs = defineDocs({
  // @ts-ignore
  dir: ["content/docs", "src/content/docs", "apps/docs/src/content/docs"],
  docs: {
    schema: frontmatterSchema.extend({
      index: z.boolean().default(false),
    }),
  },
  meta: {
    schema: metaSchema.extend({
      // other props
    }),
  },
  lastModifiedTime: "git",
});
