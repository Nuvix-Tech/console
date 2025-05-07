"use client";

import { Provider } from "./cui/provider";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { loader } from "@monaco-editor/react";
import { useEffect } from "react";
import * as monaco from 'monaco-editor';
import NuvixTheme from "@/lib/monaco-theme";

export default function Providers({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    loader.config({
      monaco
    });
    monaco.editor.defineTheme('nuvix', NuvixTheme)
  }, []);

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
