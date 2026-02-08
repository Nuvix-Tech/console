"use client";

import { Provider } from "@nuvix/cui/provider";
import { ConfirmProvider } from "@nuvix/ui/components";
import { MetaProvider } from "@nuvix/ui/contexts";
import { RootProvider } from "fumadocs-ui/provider/next";
import Link from "next/link";
import Image from "next/image";
import SearchDialog from "./search";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MetaProvider link={Link} img={Image}>
        <RootProvider
          theme={{
            attribute: ["class", "data-theme"],
            defaultTheme: "dark",
            storageKey: "data-theme",
          }}
          search={{
            SearchDialog,
          }}
        >
          <Provider attribute={["class", "data-theme"]} defaultTheme="dark">
            <ConfirmProvider>{children}</ConfirmProvider>
          </Provider>
        </RootProvider>
      </MetaProvider>
    </>
  );
}
