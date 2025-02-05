"use client";

import { ConsoleHeader } from "@/components/console/header";
import { Row } from "@/once-ui/components";
import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConsoleHeader />
      {children}
    </>
  );
}
