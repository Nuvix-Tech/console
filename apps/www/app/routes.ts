import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("components/layout/main.tsx", [index("routes/home.tsx")]),
  layout("components/layout/page.tsx", [
    route("products/authentication", "routes/products/auth.tsx"),
    route("products/database", "routes/products/database.tsx"),
    route("products/messaging", "routes/products/messaging.tsx"),
    route("products/storage", "routes/products/storage.tsx"),
  ]),
] satisfies RouteConfig;
