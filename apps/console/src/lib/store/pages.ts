"use client";
import { Models } from "@nuvix/console";
import { create } from "zustand";
import { createSelectors } from "../utils";
import { _Models } from "../external-sdk";

/**
 * Base interface for page state common across all stores.
 */
export interface PageState {
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
}

/**
 * Common update functionality for the pages.
 */
export interface Updatable {
  refresh: () => Promise<void>;
  setRefresh: (refreshFn: () => Promise<void>) => void;
}

/**
 * Store for the user page.
 */
interface UserStore extends PageState, Updatable {
  user?: Models.User<Record<string, any>>;
  setUser: (user?: Models.User<Record<string, any>>) => void;
}

export const useUser = create<UserStore>((set) => ({
  loading: true,
  user: undefined as any,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  refresh: async () => {},
  setRefresh: (refreshFn) => set({ refresh: refreshFn }),
}));

export const useUserStore = createSelectors(useUser);

/**
 * Store for the team page.
 */
interface TeamStore extends PageState, Updatable {
  team?: Models.Team<Record<string, any>>;
  setTeam: (team?: Models.Team<Record<string, any>>) => void;
}

export const useTeam = create<TeamStore>((set) => ({
  loading: true,
  team: undefined as any,
  setTeam: (team) => set({ team }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  refresh: async () => {},
  setRefresh: (refreshFn) => set({ refresh: refreshFn }),
}));

export const useTeamStore = createSelectors(useTeam);

/**
 * Store for Storage Page
 */
interface BucketStore extends PageState, Updatable {
  bucket?: Models.Bucket;
  setBucket: (bucket?: Models.Bucket) => void;
}

export const useBucket = create<BucketStore>((set) => ({
  loading: true,
  bucket: undefined as any,
  setBucket: (bucket) => set({ bucket }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  refresh: async () => {},
  setRefresh: (refreshFn) => set({ refresh: refreshFn }),
}));

export const useBucketStore = createSelectors(useBucket);

/**
 * Store for Storage File Page
 */
interface FileStore extends PageState, Updatable {
  file?: Models.File;
  setFile: (file?: Models.File) => void;
}

export const useFile = create<FileStore>((set) => ({
  loading: true,
  file: undefined as any,
  setFile: (file) => set({ file }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  refresh: async () => {},
  setRefresh: (refreshFn) => set({ refresh: refreshFn }),
}));

export const useFileStore = createSelectors(useFile);
