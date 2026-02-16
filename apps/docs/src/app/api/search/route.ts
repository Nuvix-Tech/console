import { source } from "@/lib/source";
import { createSearchAPI } from "fumadocs-core/search/server";

export const { GET } = createSearchAPI("advanced", {
  language: "english",
  indexes: source
    .getPages()
    .filter((p) => p.data.type !== "openapi")
    .map((page) => ({
      title: page.data.title as string,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
    })),
});
