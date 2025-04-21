import { TableEditorLayout } from "@/components/editor";
import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return <TableEditorLayout>{children}</TableEditorLayout>;
}
