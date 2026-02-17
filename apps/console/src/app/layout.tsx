import "@/ui/main.scss";
import "@nuvix/ui/styles/index.scss";
import "@nuvix/ui/tokens/index.scss";
import "@nuvix/sui/globals.css";
import "@nuvix/sui/styles/monaco.scss";
import "react-contexify/dist/ReactContexify.css";
import "@nuvix/sui/styles/datagrid.scss";

import Providers from "@/components/providers";
import classNames from "classnames";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Column, ToastProvider } from "@nuvix/ui/components";
import { Toaster } from "@nuvix/sui/components/sonner";
import { baseURL, meta, og } from "@nuvix/ui/resources/config";
import { fonts, ThemeInit } from "@nuvix/ui/resources";
import { customFont, sourceCodePro } from "@nuvix/ui/fonts";
import { LayoutProvider, ThemeProvider } from "@nuvix/ui/contexts";

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

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Column
        as="html"
        lang="en"
        fillHeight
        suppressHydrationWarning
        className={classNames(
          fonts.heading.variable,
          fonts.body.variable,
          fonts.label.variable,
          fonts.code.variable,
          customFont.variable,
          sourceCodePro.variable,
        )}
      >
        <head>
          <script src="/env.js"></script>
          <ThemeInit
            config={{
              theme: "system",
              brand: "custom",
              accent: "custom",
              neutral: "gray",
              solid: "color",
              "solid-style": "flat",
              border: "rounded",
              surface: "translucent",
              transition: "all",
              scaling: "100",
              "viz-style": "gradient",
            }}
          />
        </head>
        <LayoutProvider>
          <ThemeProvider>
            <Column
              suppressHydrationWarning
              as="body"
              fillWidth
              fillHeight
              margin="0"
              padding="0"
              background="page"
            >
              <ToastProvider>
                <Providers>
                  {children}
                  <Toaster position="top-right" closeButton />
                </Providers>
              </ToastProvider>
            </Column>
          </ThemeProvider>
        </LayoutProvider>
      </Column>
    </>
  );
}
