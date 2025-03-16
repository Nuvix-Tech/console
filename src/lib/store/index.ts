import { StoreApi, UseBoundStore } from "zustand";
export * from "./app";

export * from "./project";

export * from "./pages";

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
