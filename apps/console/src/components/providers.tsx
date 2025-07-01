"use client";

import { Provider } from "@nuvix/cui/provider";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { ConfirmProvider } from "@nuvix/ui/components";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProgressProvider
        height="2px"
        color="var(--brand-alpha-strong)"
        options={{ showSpinner: false }}
        shallowRouting
      >
        <Provider attribute={["class", "data-theme"]}>
          <NuqsAdapter>
            <ConfirmProvider>{children}</ConfirmProvider>
          </NuqsAdapter>
        </Provider>
      </ProgressProvider>
    </>
  );
}
