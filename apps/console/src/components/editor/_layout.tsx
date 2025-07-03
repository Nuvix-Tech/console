"use client";
import { useProjectStore } from "@/lib/store";
import React, { useEffect } from "react";
import { Sidebar } from "./components/_sidebar";

export const TableEditorLayout = ({ children }: { children: React.ReactNode }) => {
  const setSidebar = useProjectStore.use.setSidebar();

  useEffect(() => {
    setSidebar({
      title: "Table Editor",
      first: <Sidebar />,
      middle: null,
      last: null,
    });
  }, []);

  return <div className="h-[calc(100svh-68px)]">{children}</div>;
};
