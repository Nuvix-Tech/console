import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/mdx-components";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { Column } from "@nuvix/ui/components";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <>
      <DocsPage toc={page.data.toc} full={page.data.full} tableOfContent={{ style: "clerk" }}>
        <Column
          as="div"
          fillWidth
          className="mb-4 text-center !inline-block brand-on-background-weak p-3 border border-border rounded-full"
        >
          Docs are not ready yet. Visit the main site at{" "}
          <a
            href="https://nuvix.dev"
            target="_blank"
            rel="noreferrer"
            className="!underline !underline-offset-4 font-medium inline accent-on-background-weak"
          >
            nuvix.in
          </a>
          .
        </Column>
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody>
          <MDX components={mdxComponents()} />
        </DocsBody>
      </DocsPage>
    </>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
