import "@appwrite.io/pink-icons";
import "@nuvix/ui/styles/index.scss";
import "@nuvix/ui/tokens/index.scss";
import "./globals.css";

import Providers from "@/components/providers";
import classNames from "classnames";
import type { Metadata } from "next";
import { headers } from "next/headers";

import { Column, ConfirmProvider, Flex, ToastProvider } from "@nuvix/ui/components";
import { baseURL, meta, og, schema, social, style } from "@nuvix/ui/resources/config";

import { Inter } from "next/font/google";
import { Roboto_Mono, Open_Sans } from "next/font/google";

const primary = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

const code = Roboto_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

type FontConfig = {
  variable: string;
};

const secondary: FontConfig | undefined = undefined;
const tertiary = Open_Sans({
  variable: "--font-tertiary",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

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
        data-neutral={style.neutral}
        data-brand={style.brand}
        data-accent={style.accent}
        data-border={style.border}
        data-solid={style.solid}
        data-solid-style={style.solidStyle}
        data-surface={style.surface}
        data-transition={style.transition}
        data-scaling={style.scaling}
        className={classNames(
          primary.variable,
          code.variable,
          secondary ? secondary.variable : "",
          tertiary ? tertiary.variable : "",
        )}
      >
        <head>
          <script
            suppressHydrationWarning
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schemaData),
            }}
          />
        </head>
        <ToastProvider>
          <Column
            suppressHydrationWarning
            as="body"
            fillWidth
            margin="0"
            padding="0"
            background="page"
          >
            <Providers>
              <ConfirmProvider>{children}</ConfirmProvider>
            </Providers>
          </Column>
        </ToastProvider>
      </Flex>
    </>
  );
}
