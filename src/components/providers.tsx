"use client";

import { Provider } from "./ui/provider";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProgressProvider
        height="2px"
        color="var(--brand-alpha-strong)"
        options={{ showSpinner: false }}
        shallowRouting
      >
        <Provider attribute={["class", "data-theme"]}>{children}</Provider>
      </ProgressProvider>
    </>
  );
}
