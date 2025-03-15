"use client";
import classNames from "classnames";
import { PropsWithChildren } from "react";

export const ProjectLayout = ({ children }: PropsWithChildren) => {

  return (
    <div id="project" className={classNames(`project show-sidebar show-sidebar-large`)}>
      {children}
    </div>
  );
};
