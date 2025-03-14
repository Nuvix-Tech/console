"use client";
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { getProjectState } from "@/state/project-state";

export const ProjectLayout = ({ children }: PropsWithChildren) => {
  const { sidebar } = getProjectState();

  return (
    <div
      id="project"
      className={classNames(
        `project show-sidebar`,
        { "show-sidebar-large": !!(sidebar.first || sidebar.middle || sidebar.last) },
        {
          "show-sidebar-small": !(sidebar.first || sidebar.middle || sidebar.last),
        },
      )}
    >
      {children}
    </div>
  );
};
