"use client";

import { Provider } from "./ui/provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Provider attribute={["class", "data-theme"]}>{children}</Provider>
    </>
  );
}
