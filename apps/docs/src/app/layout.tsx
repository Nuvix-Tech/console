import "@nuvix/sui/globals.css";
import "@nuvix/ui/styles/index.scss";
import "@nuvix/ui/tokens/index.scss";
import "@/styles/main.scss";
import "@/styles/global.css";

import type { Metadata } from "next";
import { headers } from "next/headers";
import Providers from "@/components/providers";
import { Column, ToastProvider } from "@nuvix/ui/components";
import { Toaster } from "@nuvix/sui/components/sonner";
import { baseURL, meta, og } from "@nuvix/ui/resources/config";
import { fonts, ThemeInit } from "@nuvix/ui/resources";
import { customFont, sourceCodePro } from "@nuvix/ui/fonts";
import { LayoutProvider, ThemeProvider } from "@nuvix/ui/contexts";
import { cn } from "@nuvix/sui/lib/utils";

/*
 */
export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host");
  const metadataBase = host ? new URL(`https://${host}`) : undefined;

  return {
    title: { default: meta.title, template: "%s | Nuvix Developer Hub" },
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
        className={cn(
          fonts.heading.variable,
          fonts.body.variable,
          fonts.label.variable,
          fonts.code.variable,
          customFont.variable,
          sourceCodePro.variable,
        )}
      >
        <head>
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
              margin="0"
              padding="0"
              background="page"
            >
              <Providers>
                <ToastProvider>
                  {children}
                  <Toaster />
                </ToastProvider>
              </Providers>
            </Column>
          </ThemeProvider>
        </LayoutProvider>
      </Column>
    </>
  );
}
