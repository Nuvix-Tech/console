"use client";

import { Provider } from "@nuvix/cui/provider";
import { ConfirmProvider } from "@nuvix/ui/components";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Provider attribute={["class", "data-theme"]}>
        <ConfirmProvider>{children}</ConfirmProvider>
      </Provider>
    </>
  );
}
