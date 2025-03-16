"use client";
import { useProjectStore } from "@/lib/store";
import React, { PropsWithChildren, useEffect } from "react";

const DatabaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const setSidebarNull = useProjectStore.use.setSidebarNull();

  useEffect(() => {
    setSidebarNull();
  }, []);

  return <>{children}</>;
};

export { DatabaseLayout };
