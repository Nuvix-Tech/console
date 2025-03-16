import { Models } from "@nuvix/console";
import { create } from "zustand";

interface UserPageStore {
  user?: Models.User<Record<string, any>>;
  setUser: (user?: Models.User<Record<string, any>>) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  update: () => Promise<void>; // this is an example, it will be useful later
  setUpdateFn: (update: () => Promise<void>) => void;
}

export const useUserPageStore = create<UserPageStore>((set) => ({
  setUser: (user) => set({ user }),
  loading: true,
  setLoading: (loading) => set({ loading }),
  update: async () => {},
  setUpdateFn: (update) => set({ update }),
}));

interface TeamPageStore {
  team?: Models.Team<Record<string, any>>;
  setTeam: (team?: Models.Team<Record<string, any>>) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  update: () => Promise<void>; // this is an example, it will be useful later
  setUpdateFn: (update: () => Promise<void>) => void;
}

export const useTeamPageStore = create<TeamPageStore>((set) => ({
  setTeam: (team) => set({ team }),
  loading: true,
  setLoading: (loading) => set({ loading }),
  update: async () => {},
  setUpdateFn: (update) => set({ update }),
}));

type UpdateProps = { update: () => Promise<any | void>; setUpdateFn: (update: () => Promise<any | void>) => void };

interface DatabasePageStore {
  database?: Models.Database;
  setDatabase: (database?: Models.Database) => void;
  loading: boolean;
  setUpdateFn: (update: () => Promise<void>) => void;
  setLoading: (loading: boolean) => void;
}

export const useDbPageStore = create<DatabasePageStore & UpdateProps>((set) => ({
  loading: true,
  setDatabase: (database) => set({ database }),
  setLoading: (loading) => set({ loading }),
  setUpdateFn: (update) => set({ update }),
  update: async () => {},
}));

interface CollectionPageStore {
  collection?: Models.Collection;
  setCollection: (collection?: Models.Collection) => void;
  setUpdateFn: (update: () => Promise<void>) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useCollectionPageStore = create<CollectionPageStore & UpdateProps>((set) => ({
  loading: true,
  setCollection: (collection) => set({ collection }),
  setLoading: (loading) => set({ loading }),
  setUpdateFn: (update) => set({ update }),
  update: async () => {},
}));

interface DocumentPageStore<T = unknown> {
  document?: T extends Models.Document ? T : Models.Document;
  setDocument: (document?: T extends Models.Document ? T : Models.Document) => void;
  setUpdateFn: (update: () => Promise<void>) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useDocumentPageStore = create<DocumentPageStore & UpdateProps>((set) => ({
  loading: true,
  setDocument: (document) => set({ document }),
  setLoading: (loading) => set({ loading }),
  setUpdateFn: (update) => set({ update }),
  update: async () => {},
}));
