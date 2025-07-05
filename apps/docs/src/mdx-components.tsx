import type { MDXComponents } from "mdx/types";
import { baseMdxComponents } from "./lib/mdx-components-map";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...baseMdxComponents,
    ...import("@nuvix/ui/components"),
  };
}
