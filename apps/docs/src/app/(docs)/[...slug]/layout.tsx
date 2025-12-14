import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import { DocsLayout } from "@/components/root";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  return <DocsLayout tree={source.pageTree}>{children}</DocsLayout>;
}
