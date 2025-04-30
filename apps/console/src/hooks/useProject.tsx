"use client";
import { ProjectContext } from "@/lib/store/project";
import React from "react";

export const useProject = () => {
  const { data, dispatch } = React.useContext(ProjectContext);

  const setSideLinks = (sideLinks: any) => {
    dispatch({ action: "UPDATE_SIDEBAR_LINKS", data: sideLinks });
  };

  return { ...data, setSideLinks };
};
