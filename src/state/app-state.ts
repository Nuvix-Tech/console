import { proxy } from "valtio";
import { Models } from "@nuvix/console";
import type { sdkForProject } from "@/lib/sdk";

interface AppState {
  isDrawerOpen: boolean;

  organization: Models.Organization<any>;
  user: Models.User<any>;
}

export const appState = proxy<AppState>({
  // app state
  isDrawerOpen: false,

  // user state
  organization: null as unknown as Models.Organization<any>,
  user: null as unknown as Models.User<any>,
});
