"use client";
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { getProjectState } from "@/state/project-state";

export const ProjectLayout = ({ children }: PropsWithChildren) => {
  const { sidebar } = getProjectState();

  return (
    <div id="project" className={classNames(`project show-sidebar show-sidebar-large`)}>
      {children}
    </div>
  );
};
