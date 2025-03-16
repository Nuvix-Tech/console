"use client";
import React, { PropsWithChildren, useEffect } from "react";
import { SettingsSidebar } from "./components";
import { useProject } from "@/lib/store";

const SettingsLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { setSidebar, setSidebarNull } = useProject()

  useEffect(
    () => {
      setSidebarNull('first'),
        setSidebar({
          middle: <SettingsSidebar />
        })
    }, []
  )

  return children;
};

export { SettingsLayout };
