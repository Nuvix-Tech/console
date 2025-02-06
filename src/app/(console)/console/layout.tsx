import { ConsoleHeader } from "@/components/console/header";
import type React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConsoleHeader />
      {children}
    </>
  );
}
