import type { Models } from "@nuvix/console";
import React from "react";
import { sdkForProject } from "../sdk";
import { ProjectSidebarData } from "@/components/console/sidebar";

export interface ProjectContextData {
  project: Models.Project;
  loading: boolean;
  sideLinks: ProjectSidebarData[];
  sdk: typeof sdkForProject;
  [key: string]: any;
}

export const ProjectContext = React.createContext<{
  data: Partial<ProjectContextData>;
  dispatch: React.Dispatch<React.SetStateAction<Partial<ProjectContextData>>>;
}>({
  data: {},
  dispatch: () => {},
});
