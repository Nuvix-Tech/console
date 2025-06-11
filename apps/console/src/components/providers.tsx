"use client";

import { Provider } from "./cui/provider";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
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
        <NuqsAdapter>
          <Provider attribute={["class", "data-theme"]}>{children}</Provider>
        </NuqsAdapter>
      </ProgressProvider>
    </>
  );
}
