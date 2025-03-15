"use client";
import { projectState } from "@/state/project-state";
import React, { PropsWithChildren } from "react";
import { SettingsSidebar } from "./components";

const SettingsLayout: React.FC<PropsWithChildren> = ({ children }) => {
  projectState.sidebar.first = null;
  projectState.sidebar.middle = <SettingsSidebar />;

  return children;
};

export { SettingsLayout };
