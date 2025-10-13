import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/mdx-components";
import {
  PageArticle,
  PageBreadcrumb,
  PageFooter,
  PageLastUpdate,
  PageRoot,
  PageTOC,
  PageTOCItems,
  PageTOCPopover,
  PageTOCPopoverContent,
  PageTOCPopoverItems,
  PageTOCPopoverTrigger,
  PageTOCTitle,
} from "fumadocs-ui/layouts/docs/page";
import { Rate } from "@/components/rate";
import { Icon } from "@nuvix/ui/components";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const lastEditedAt = page.data.lastModified;

  return (
    <>
      <PageRoot
        toc={{
          toc: page.data.toc,
        }}
        className="mx-0"
      >
        {page.data.toc?.length > 0 && (
          <PageTOCPopover>
            <PageTOCPopoverTrigger />
            <PageTOCPopoverContent>
              <PageTOCPopoverItems />
            </PageTOCPopoverContent>
          </PageTOCPopover>
        )}
        <PageArticle className="docs-page-article lg:max-w-2xl">
          <PageBreadcrumb />
          <h1 className="text-3xl font-semibold">{page.data.title}</h1>
          <p className="text-lg text-fd-muted-foreground">{page.data.description}</p>
          {/* <div className="flex flex-row gap-2 items-center border-b pb-6"> */}
          {/* <LLMCopyButton slug={slugs} contextual={docsJson?.contextual} /> */}
          {/* <ViewOptions
            markdownUrl={`${slug}.mdx`}
            githubUrl={owner && repo ? `https://github.com/${owner}/${repo}/blob/${githubBranch}/${githubPath}` : undefined}
            contextual={docsJson?.contextual}
          /> */}
          {/* </div> */}

          <div className="prose flex-1 text-fd-foreground/80">
            <MDX components={mdxComponents} />
          </div>
          <div className="grow"></div>
          <Rate />
          {lastEditedAt && (
            <div className="flex items-center gap-2">
              <PageLastUpdate date={lastEditedAt} />
              <div className="grow"></div>
            </div>
          )}

          <Footer footer={{}} />
          <PageFooter />
        </PageArticle>

        <PageTOC className="mt-12 mr-6">
          <PageTOCTitle />
          <PageTOCItems variant={"clerk"} />
        </PageTOC>
      </PageRoot>
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

function Footer({ footer }: { footer?: any }): any {
  if (!footer) return null;

  // Calculate responsive grid columns based on number of link columns
  const numColumns = footer.links?.length || 0;
  const gridCols =
    numColumns === 1
      ? "grid-cols-1"
      : numColumns === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : numColumns === 3
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          : numColumns === 4
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            : numColumns === 5
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6";

  return (
    <div className="flex flex-col gap-4 border-t pt-4">
      {/* Social Links */}
      {footer.socials && (
        <div className="flex gap-3">
          {Object.entries(footer.socials).map(([platform, url]: [string, any]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
              aria-label={platform}
            >
              <SocialIcon platform={platform} />
            </a>
          ))}
        </div>
      )}

      {/* Link Columns */}
      {footer.links && (
        <div className={`grid gap-6 ${gridCols}`}>
          {footer.links.map((column: any, index: number) => (
            <div key={index} className="flex flex-col gap-2">
              {column.header && (
                <h4 className="font-medium text-fd-foreground text-sm">{column.header}</h4>
              )}
              <div className="flex flex-col gap-1">
                {column.items.map((item: any, itemIndex: number) => (
                  <a
                    key={itemIndex}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  const iconClass = "w-4 h-4";

  switch (platform.toLowerCase()) {
    case "github":
      return <Icon name="github" className={iconClass} />;
    case "twitter":
    case "x":
      return <Icon name="refresh" className={iconClass} />;
    case "discord":
      return <Icon name="discord" className={iconClass} />;
    case "linkedin":
      return <Icon name="refresh" className={iconClass} />;
    default:
      return <Icon name="externalLink" className={iconClass} />;
  }
}
