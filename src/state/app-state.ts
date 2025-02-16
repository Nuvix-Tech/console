import { proxy } from "valtio";
import { Models } from "@nuvix/console";
import type { sdkForProject } from "@/lib/sdk";
import { useProxy } from "valtio/utils";

interface AppState {
  isDrawerOpen: boolean;
  isSecondMenuOpen: boolean;

  organization: Models.Organization<any>;
  user: Models.User<any>;
}

export const appState = proxy<AppState>({
  // app state
  isDrawerOpen: false,
  isSecondMenuOpen: false,

  // user state
  organization: null as unknown as Models.Organization<any>,
  user: null as unknown as Models.User<any>,
});

export const getAppState = () => useProxy(appState);
