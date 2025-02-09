import { proxy } from "valtio";
import { Models } from "@nuvix/console";
import type { sdkForProject } from "@/lib/sdk";

interface AppState {
  isDrawerOpen: boolean;

  organization: Models.Organization<any>;
  user: Models.User<any>;

  project: Models.Project | null;
  sdk: typeof sdkForProject | null;
}

export const appState = proxy<AppState>({
  // app state
  isDrawerOpen: false,

  // user state
  organization: null as unknown as Models.Organization<any>,
  user: null as unknown as Models.User<any>,
  project: null as unknown as Models.Project,
  sdk: null as unknown as typeof sdkForProject,
});
