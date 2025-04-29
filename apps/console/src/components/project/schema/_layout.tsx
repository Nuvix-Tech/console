"use client";
import { useProjectStore } from "@/lib/store";
import React, { PropsWithChildren, useEffect } from "react";
import { DatbaseSidebar } from "./components/_sidebar";

const DatabaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const setSidebar = useProjectStore.use.setSidebar();

  useEffect(() => {
    setSidebar({
      first: <DatbaseSidebar />,
    });
  }, []);

  return <>{children}</>;
};

export { DatabaseLayout };
