import { ConsoleHeader } from "@/components/console/header";
import { Row } from "@/ui/components";
import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConsoleHeader />
      <Row fill position="relative" top="64" as={"main"} style={{ display: "block" }}>
        {children}
      </Row>
    </>
  );
}
