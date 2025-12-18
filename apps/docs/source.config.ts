import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";
import { z } from "zod";
import { transformerTwoslash } from "fumadocs-twoslash";
import { createFileSystemTypesCache } from "fumadocs-twoslash/cache-fs";
import remarkMath from "remark-math";
import { remarkTypeScriptToJavaScript } from "fumadocs-docgen/remark-ts2js";
import rehypeKatex from "rehype-katex";
import {
  remarkDirectiveAdmonition,
  remarkMdxFiles,
  remarkGfm,
  remarkHeading,
  rehypeCodeDefaultOptions,
  remarkCodeTab,
  remarkSteps,
} from "fumadocs-core/mdx-plugins";
import { remarkAutoTypeTable } from "fumadocs-typescript";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import type { ElementContent } from "hast";
import {
  remarkCodeGroup,
  remarkExtractFirstHeading,
  remarkMermaidCode,
  remarkSingleAccordionItems,
} from "@/lib/remark-plugins";

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      lazy: true,
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
      remarkDirectiveAdmonition,
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
  plugins: [lastModified()],
});

export const docs = defineDocs({
  dir: "src/content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      index: z.boolean().default(false),
      layout: z.enum(["article", "overview"]).optional().default("article"),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema.extend({
      // other props
    }),
  },
});
