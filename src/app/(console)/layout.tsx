import ConsoleWrapper from "@/components/console/wrapper";
import { Row } from "@/ui/components";
import type React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConsoleWrapper>
        <Row fill>{children}</Row>
      </ConsoleWrapper>
    </>
  );
}
