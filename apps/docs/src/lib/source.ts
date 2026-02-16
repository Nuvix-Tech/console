import { iconLibrary } from "@nuvix/ui/icons";
import { docs } from "../../.source/server";
import { loader, multiple } from "fumadocs-core/source";
import { icons } from "lucide-react";
import { createElement } from "react";
import { openapiPlugin, openapiSource } from "fumadocs-openapi/server";
import { openapi } from "./openapi";

export const source = loader(
  multiple({
    docs: docs.toFumadocsSource(),
    openapi: await openapiSource(openapi, {
      baseDir: "references",
      per: "operation",
      groupBy: "tag",
    }),
  }),
  {
    baseUrl: "/",
    icon(icon) {
      if (!icon) {
        // You may set a default icon
        return;
      }
      if (icon in iconLibrary) return createElement(iconLibrary[icon as keyof typeof iconLibrary]);
      if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
    },
    plugins: [openapiPlugin()],
  },
);
