import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/raw/[...docs]">) {
  const { docs } = await ctx.params;

  if (!docs.at(-1)?.endsWith(".md")) {
    return notFound();
  }

  const slug = [...docs.slice(0, -1), docs.at(-1)?.slice(0, -3)!];
  const page = source.getPage(slug);
  if (!page || page.data.type === "openapi") return notFound();

  const markdown = await page.data.getText("raw");

  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
