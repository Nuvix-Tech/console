"use client";
import React, { PropsWithChildren, useEffect } from "react";
import { SettingsSidebar } from "./components";
import { useProjectStore } from "@/lib/store";

const SettingsLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const setSidebar = useProjectStore.use.setSidebar();

  useEffect(() => {
    setSidebar({
      title: "Settings",
      first: null,
      middle: <SettingsSidebar />,
    });
  }, []);

  return children;
};

export { SettingsLayout };
