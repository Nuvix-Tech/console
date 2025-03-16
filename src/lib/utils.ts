import { clsx, type ClassValue } from "clsx";
import { StoreApi, UseBoundStore } from "zustand";
import { twMerge } from "tailwind-merge";

export const formatDate = (date?: string | Date) => {
  if (!date) return null;
  date = typeof date === "string" ? new Date(date) : date;

  const theDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return `${theDate}, ${time}`;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S): WithSelectors<typeof _store> => {
  if (typeof window === "undefined") return {} as WithSelectors<typeof _store>;
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};