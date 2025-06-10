import { PageState, Updatable } from "@/lib/store";
import { createSelectors } from "@/lib/utils";
import { Models } from "@nuvix/console";
import { create } from "zustand";

interface ProviderStore extends PageState, Updatable {
    provider?: Models.Provider;
    setProvider: (provider?: Models.Provider) => void;
}

export const useProvider = create<ProviderStore>((set) => ({
    loading: true,
    setProvider: (provider) => set({ provider }),
    setLoading: (isLoading) => set({ loading: isLoading }),
    refresh: async () => { },
    setRefresh: (refreshFn) => set({ refresh: refreshFn }),
}));

export const useProviderStore = createSelectors(useProvider);
