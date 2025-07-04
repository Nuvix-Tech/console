"use client";
import { PanelGroup } from "@nuvix/sui/components/resizable";
import { PropsWithChildren } from "react";

export const ProjectLayout = ({ children }: PropsWithChildren) => {
  const onLayout = (sizes: number[]) => {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 10);

    document.cookie = `nx-panels:project=${JSON.stringify(sizes)}; path=/; expires=${expiryDate.toUTCString()}`;
  };

  return (
    <PanelGroup direction="horizontal" onLayout={onLayout}>
      {children}
    </PanelGroup>
  );
};
