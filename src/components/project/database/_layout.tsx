"use client";
import { projectState } from "@/state/project-state";
import React, { PropsWithChildren } from "react";

const DatabaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  projectState.sidebar.first = null;
  projectState.sidebar.middle = null;

  return <>{children}</>;
};

export { DatabaseLayout };
