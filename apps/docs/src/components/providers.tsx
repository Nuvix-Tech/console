"use client";

import { Provider } from "@nuvix/cui/provider";
import { ConfirmProvider } from "@nuvix/ui/components";
import { ToastProvider } from "@nuvix/ui/components/ToastProvider";
import { MetaProvider } from "@nuvix/ui/contexts";
import { RootProvider } from "fumadocs-ui/provider";
import Link from "next/link";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MetaProvider link={Link} img={Image}>
        <RootProvider theme={{ attribute: ["class", "data-theme"], defaultTheme: "dark" }}>
          <Provider attribute={["class", "data-theme"]} defaultTheme="dark">
            <ConfirmProvider>{children}</ConfirmProvider>
          </Provider>
        </RootProvider>
      </MetaProvider>
    </>
  );
}
