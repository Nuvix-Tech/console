import "@/styles/global.css";
// import { Column, Row } from "@nuvix/ui/components";
// import { HeadingNav } from "@nuvix/ui/modules";
// import { Header } from "@/components/header";
// import { Sidebar } from "@/components/sidebar";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { source } from "@/lib/source";
import { layoutProps } from "@/components/layout/base-layout";
import type { SidebarOptions } from "fumadocs-ui/layouts/docs/shared";
import type { PageTree } from "fumadocs-core/server";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DocsLayout
        {...layoutProps()}
        tree={source.pageTree}
        nav={{ ...layoutProps().nav, mode: "auto" }}
        tabMode="navbar"
        sidebar={{
          components: {},
          collapsible: true,
          className: "backdrop-blur-md",
        }}
      >
        {children}
      </DocsLayout>
    </>
  );
}
