import { Models } from "@nuvix/console";
import { proxy } from "valtio";
import { useProxy } from "valtio/utils";

interface UserPageState {
  user?: Models.User<Record<string, any>>;
  loading: boolean;
  _update: () => Promise<void>;
}

export const userPageState = proxy<UserPageState>({
  loading: true,
  _update: async () => {},
});

export const getUserPageState = () => useProxy(userPageState);

interface TeamPageState {
  team?: Models.Team<Record<string, any>>;
  loading: boolean;
  _update: () => Promise<void>;
}

export const teamPageState = proxy<TeamPageState>({
  loading: true,
  _update: async () => {},
});

export const getTeamPageState = () => useProxy(teamPageState);
