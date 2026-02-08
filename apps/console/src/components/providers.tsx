"use client";

import { Provider } from "@nuvix/cui/provider";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { ConfirmProvider } from "@nuvix/ui/components";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { MetaProvider } from "@nuvix/ui/contexts";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "@bprogress/next";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MetaProvider link={Link} img={Image} usePathname={usePathname} useRouter={useRouter}>
        <ProgressProvider
          height="2px"
          color="var(--brand-alpha-strong)"
          options={{ showSpinner: false }}
          shallowRouting
        >
          <Provider attribute={["class", "data-theme"]} storageKey="data-theme">
            <NuqsAdapter>
              <ConfirmProvider>{children}</ConfirmProvider>
            </NuqsAdapter>
          </Provider>
        </ProgressProvider>
      </MetaProvider>
    </>
  );
}
