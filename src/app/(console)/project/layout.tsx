import { ProjectHeader } from "@/components/project/header";
import { Row } from "@/ui/components";
import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProjectHeader />
      <Row
        fill
        position="relative"
        top="64"
        as={"main"}
        style={{ display: "block" }}
        className="console-main"
      >
        {children}
      </Row>
    </>
  );
}
