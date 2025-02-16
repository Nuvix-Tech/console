import type { Models } from "@nuvix/console";
import React from "react";
import { sdkForProject } from "../sdk";
import { ProjectSidebarData } from "@/components/project/sidebar";

export interface ProjectContextData {
  project: Models.Project;
  loading: boolean;
  sideLinks: ProjectSidebarData[];
  sdk: typeof sdkForProject;
  [key: string]: any;
}

export type dispatchAction = "UPDATE_PROJECT" | "UPDATE_SIDEBAR_LINKS";
export type dispatchData = {
  action: dispatchAction;
  data: any;
};

export const ProjectContext = React.createContext<{
  data: Partial<ProjectContextData>;
  dispatch: (data: dispatchData) => void;
  update: (data: Partial<ProjectContextData>) => void;
}>({
  data: {},
  dispatch: () => {},
  update: () => {},
});
