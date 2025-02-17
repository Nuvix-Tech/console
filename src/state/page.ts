import { Models } from "@nuvix/console";
import { proxy } from "valtio";

interface UserPageState {
  user: Models.User<Record<string, any>>
}

export const userPageState = proxy<UserPageState>({
  user: null as unknown as Models.User<any>,
});

interface TeamPageState {
  team: Models.Team<Record<string, any>>
}

export const teamPageState = proxy<TeamPageState>({
  team: null as unknown as Models.Team<any>,
});
