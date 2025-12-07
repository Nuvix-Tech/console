import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
  defineCollections,
} from "fumadocs-mdx/config";
import { z } from "zod";
import { transformerTwoslash } from "fumadocs-twoslash";
import { createFileSystemTypesCache } from "fumadocs-twoslash/cache-fs";
import remarkMath from "remark-math";
import { remarkTypeScriptToJavaScript } from "fumadocs-docgen/remark-ts2js";
import rehypeKatex from "rehype-katex";
import {
  remarkAdmonition,
  remarkMdxFiles,
  remarkGfm,
  remarkHeading,
  rehypeCodeDefaultOptions,
  remarkCodeTab,
  remarkSteps,
} from "fumadocs-core/mdx-plugins";
import { remarkAutoTypeTable } from "fumadocs-typescript";
import type { ElementContent } from "hast";
import {
  remarkCodeGroup,
  remarkExtractFirstHeading,
  remarkMermaidCode,
  remarkSingleAccordionItems,
} from "@/lib/remark-plugins";

export default defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    rehypeCodeOptions: {
      lazy: true,
      experimentalJSEngine: true,
      langs: ["ts", "js", "html", "tsx", "mdx"],
      inline: "tailing-curly-colon",
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash({
          typesCache: createFileSystemTypesCache(),
        }),
        {
          name: "@shikijs/transformers:remove-notation-escape",
          code(hast) {
            function replace(node: ElementContent): void {
              if (node.type === "text") {
                node.value = node.value.replace("[\\!code", "[!code");
              } else if ("children" in node) {
                for (const child of node.children) {
                  replace(child);
                }
              }
            }

            replace(hast);
            return hast;
          },
        },
      ],
    },
    remarkCodeTabOptions: {
      parseMdx: true,
    },
    remarkNpmOptions: {
      persist: {
        id: "package-manager",
      },
    },
    remarkPlugins: [
      remarkAdmonition,
      remarkMdxFiles,
      remarkGfm,
      remarkCodeTab,
      remarkHeading,
      remarkExtractFirstHeading,
      remarkSteps,
      remarkTypeScriptToJavaScript,
      remarkCodeGroup,
      remarkMath,
      remarkAutoTypeTable,
      remarkMermaidCode,
      remarkSingleAccordionItems,
    ],
    rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});

export const docs = defineDocs({
  // dir: ["content/docs", "src/content/docs", "apps/docs/src/content/docs"],
  dir: "apps/docs/content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      index: z.boolean().default(false),
      layout: z.enum(["article", "overview"]).optional().default("article"),
    }),
  },
  meta: {
    schema: metaSchema.extend({
      // other props
    }),
  },
  lastModifiedTime: "git",
});
