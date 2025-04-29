"use client";
import { useProjectStore } from "@/lib/store";
import React, { useEffect } from "react";
import { Sidebar } from "./components/_sidebar";

export const TableEditorLayout = ({ children }: { children: React.ReactNode }) => {
  const setSidebar = useProjectStore.use.setSidebar();

  useEffect(() => {
    setSidebar({
      first: <Sidebar />,
      middle: null,
      last: null,
    });
  }, []);

  return children;
};
