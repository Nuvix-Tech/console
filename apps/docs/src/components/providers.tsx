"use client";

import { Provider } from "@nuvix/cui/provider";
import { ConfirmProvider } from "@nuvix/ui/components";
import { RootProvider } from "fumadocs-ui/provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RootProvider theme={{ attribute: ["class", "data-theme"] }}>
        <Provider attribute={["class", "data-theme"]}>
          <ConfirmProvider>{children}</ConfirmProvider>
        </Provider>
      </RootProvider>
    </>
  );
}
