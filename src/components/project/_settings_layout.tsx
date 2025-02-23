"use client";
import { projectState } from "@/state/project-state";
import React, { PropsWithChildren } from "react";
import { SettingsSidebar } from "./components";

const SettingsLayout: React.FC<PropsWithChildren> = ({ children }) => {
  projectState.sidebar.first = null;
  projectState.sidebar.middle = <SettingsSidebar />;

  React.useEffect(() => {
    const elementProject = document.getElementById("project");
    if (elementProject) {
      elementProject.classList.add("show-sidebar-large");
    }
  }, []);

  return children;
};

export { SettingsLayout };
