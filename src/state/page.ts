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

type UpdateProps = { _update: () => Promise<any | void> };

interface DatabasePageState {
  database?: Models.Database;
  loading: boolean;
}

export const dbPageState = proxy<DatabasePageState & UpdateProps>({
  loading: true,
  _update: async () => {},
});

export const getDbPageState = () => useProxy(dbPageState);

interface CollectionPageState {
  collection?: Models.Collection;
  loading: boolean;
}

export const collectionPageState = proxy<CollectionPageState & UpdateProps>({
  loading: true,
  _update: async () => {},
});

export const getCollectionPageState = () => useProxy(collectionPageState);

interface DocumentPageState<T = unknown> {
  document?: T extends Models.Document ? T : Models.Document;
  loading: boolean;
}

export const documentPageState = proxy<DocumentPageState & UpdateProps>({
  loading: true,
  _update: async () => {},
});

export const getDocumentPageState = <T>() =>
  useProxy<DocumentPageState<T> & UpdateProps>(documentPageState as any);
