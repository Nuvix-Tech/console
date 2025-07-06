import "@/styles/global.css";
// import { Column, Row } from "@nuvix/ui/components";
// import { HeadingNav } from "@nuvix/ui/modules";
// import { Header } from "@/components/header";
// import { Sidebar } from "@/components/sidebar";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Header />
      <Sidebar />
      <Row position="relative" className="ml-[256px]" marginTop="64" padding="16">
        <Column className="flex-1"> */}
      <DocsLayout tree={source.pageTree}>{children}</DocsLayout>
      {/* </Column>
        <Column width={16} minWidth={16} position="relative">
          <HeadingNav width={16} position="sticky" top="64" fitHeight />
        </Column>
      </Row> */}
    </>
  );
}
