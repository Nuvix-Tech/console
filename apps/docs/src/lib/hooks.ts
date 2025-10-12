import { useSyncExternalStore } from "react";

const fn = (callback: any) => {
  return () => {};
};

export function useHydrated() {
  return useSyncExternalStore(
    fn,
    () => true, // client snapshot
    () => false, // server snapshot (always false)
  );
}
