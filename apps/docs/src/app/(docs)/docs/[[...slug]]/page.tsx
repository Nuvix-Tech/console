import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/mdx-components";
import { Text } from "@nuvix/ui/components";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <>
      {/* <DocsPage toc={page.data.toc} full={page.data.full}> */}
      <Text as="h1" className="text-4xl font-bold">
        {page.data.title}
      </Text>
      {/* <DocsDescription>{page.data.description}</DocsDescription> */}
      {/* <DocsBody> */}
      <MDX components={mdxComponents} />
      {/* </DocsBody>
         </DocsPage> */}
    </>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
