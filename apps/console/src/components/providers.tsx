"use client";

import { Provider } from "./cui/provider";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { loader } from "@monaco-editor/react";

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
