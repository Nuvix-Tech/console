import { CollectionsEditorLayout } from "@/components/project/collection-editor";
import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return <CollectionsEditorLayout>{children}</CollectionsEditorLayout>;
}
