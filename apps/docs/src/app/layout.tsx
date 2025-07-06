import "@nuvix/ui/styles/index.scss";
import "@nuvix/ui/tokens/index.scss";
import "@nuvix/sui/globals.css";
import "@/styles/main.scss";

import type { Metadata } from "next";
import { headers } from "next/headers";
import Providers from "@/components/providers";

import { Column, Flex, ToastProvider } from "@nuvix/ui/components";
import { Toaster } from "@nuvix/sui/components/sonner";
import { baseURL, meta, og, schema, social, style } from "@nuvix/ui/resources/config";
import { customFont, sourceCodePro } from "@nuvix/ui/fonts";
import { cn } from "@nuvix/sui/lib/utils";

/*
 */
export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host");
  const metadataBase = host ? new URL(`https://${host}`) : undefined;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: og.title,
      description: og.description,
      url: "https://" + baseURL,
      images: [
        {
          url: og.image,
          alt: og.title,
        },
      ],
      type: og.type as
        | "website"
        | "article"
        | "book"
        | "profile"
        | "music.song"
        | "music.album"
        | "music.playlist"
        | "music.radio_station"
        | "video.movie"
        | "video.episode"
        | "video.tv_show"
        | "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title: og.title,
      description: og.description,
      images: [og.image],
    },
    metadataBase,
  };
}

const schemaData = {
  "@context": "https://schema.org",
  "@type": schema.type,
  url: "https://" + baseURL,
  logo: schema.logo,
  name: schema.name,
  description: schema.description,
  email: schema.email,
  sameAs: Object.values(social).filter(Boolean),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Flex
        suppressHydrationWarning
        as="html"
        lang="en"
        fillHeight
        background="page"
        data-neutral={"gray"}
        data-brand={style.brand}
        data-accent={style.accent}
        data-border={style.border}
        data-solid={style.solid}
        data-solid-style={style.solidStyle}
        data-surface={style.surface}
        data-transition={style.transition}
        data-scaling={style.scaling}
        className={cn(customFont.variable, sourceCodePro.variable)}
      >
        <ToastProvider>
          <Column
            suppressHydrationWarning
            as="body"
            fillWidth
            margin="0"
            position="relative"
            padding="0"
          >
            <Providers>{children}</Providers>
            <Toaster />
          </Column>
        </ToastProvider>
      </Flex>
    </>
  );
}
