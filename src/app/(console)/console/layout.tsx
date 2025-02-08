import { ConsoleHeader } from "@/components/console/header";
import { Row } from "@/ui/components";
import type React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Row fill>
        <ConsoleHeader />
        <Row fill position="relative" top="64" as={"main"} style={{ display: "block" }}>
          {children}
        </Row>
      </Row>
    </>
  );
}
