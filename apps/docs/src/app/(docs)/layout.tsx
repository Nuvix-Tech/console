import "@/styles/global.css";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { source } from "@/lib/source";
import { layoutProps } from "@/components/layout/base-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DocsLayout
        {...layoutProps()}
        tree={source.pageTree}
        nav={{ ...layoutProps().nav, mode: "top" }}
        tabMode="sidebar"
        sidebar={{
          collapsible: true,
          className: "backdrop-blur-md",
        }}
      >
        {children}
      </DocsLayout>
    </>
  );
}
