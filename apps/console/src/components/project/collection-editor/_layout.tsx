"use client";
import { useProjectStore } from "@/lib/store";
import React, { useEffect } from "react";
import { Sidebar } from "./components/_sidebar";

export const CollectionsEditorLayout = ({ children }: { children: React.ReactNode }) => {
  const setSidebar = useProjectStore.use.setSidebar();

  useEffect(() => {
    setSidebar({
      title: "Collection Editor",
      first: <Sidebar />,
      middle: null,
      last: null,
    });
  }, []);

  return <div className="h-full">{children}</div>;
};
