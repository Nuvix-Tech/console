"use client";
import { PanelGroup } from "@nuvix/sui/components/resizable";
import { PropsWithChildren } from "react";

export const ProjectLayout = ({ children }: PropsWithChildren) => {
  const onLayout = (sizes: number[]) => {
    document.cookie = `nx-panels:project=${JSON.stringify(sizes)}`;
  };

  return (
    <PanelGroup direction="horizontal" onLayout={onLayout}>
      {children}
    </PanelGroup>
  );
};
