import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("components/layout/main.tsx", [
    index("routes/home.tsx"),

    // route("products/databases", "routes/products/databases.tsx"),
    route("products/auth", "routes/products/auth.tsx"),
    // route("products/storage", "routes/products/storage.tsx"),
  ]),
] satisfies RouteConfig;
