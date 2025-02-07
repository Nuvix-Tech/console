"use client";
import { ProjectContext } from "@/lib/store/project";
import React from "react";

export const useProject = () => {
  const { data, dispatch } = React.useContext(ProjectContext);

  return data;
};
