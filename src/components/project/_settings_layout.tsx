"use client";
import React, { PropsWithChildren, useEffect } from "react";
import { SettingsSidebar } from "./components";
import { useProjectStore } from "@/lib/store";

const SettingsLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const setSidebar = useProjectStore.use.setSidebar();
  const setSidebarNull = useProjectStore.use.setSidebarNull();

  useEffect(() => {
    setSidebarNull("first"),
      setSidebar({
        middle: <SettingsSidebar />,
      });
  }, []);

  return children;
};

export { SettingsLayout };
