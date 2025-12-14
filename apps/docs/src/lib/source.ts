import { iconLibrary } from "@nuvix/ui/icons";
import { docs } from "../../.source/server";
import { loader } from "fumadocs-core/source";
import { icons } from "lucide-react";
import { createElement } from "react";

export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (!icon) {
      // You may set a default icon
      return;
    }
    if (icon in iconLibrary) return createElement(iconLibrary[icon as keyof typeof iconLibrary]);
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});
