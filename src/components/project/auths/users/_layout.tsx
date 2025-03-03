"use client";
import { projectState } from "@/state/project-state";
import React from "react";

const UsersLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebar } = projectState;
  sidebar.last = null;

  return <>{children}</>;
};

export default UsersLayout;
