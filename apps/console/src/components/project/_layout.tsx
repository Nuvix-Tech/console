"use client";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { PanelGroup } from "@nuvix/sui/components/resizable";
import { PropsWithChildren } from "react";

export const ProjectLayout = ({ children }: PropsWithChildren) => {
  return (
    <PanelGroup direction="horizontal" autoSaveId={LOCAL_STORAGE_KEYS.SIDEBAR_BEHAVIOR}>
      {children}
    </PanelGroup>
  );
};
