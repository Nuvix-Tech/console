import type { Models } from "@nuvix/console";
import React from "react";

export interface ProjectContextData {
  user: Models.User<{}>;
  [key: string]: any;
}

export const ProjectContext = React.createContext<{
  data: Partial<ProjectContextData>;
  dispatch: React.Dispatch<React.SetStateAction<Partial<ProjectContextData>>>;
}>({
  data: {},
  dispatch: () => {},
});
