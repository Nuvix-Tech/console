import { PageState, Updatable } from "@/lib/store";
import { createSelectors } from "@/lib/utils";
import { Models } from "@nuvix/console";
import { create } from "zustand";

interface MessageStore extends PageState, Updatable {
  message?: Models.Message;
  setMessage: (message?: Models.Message) => void;
}

export const useMessage = create<MessageStore>((set) => ({
  loading: true,
  setMessage: (message) => set({ message }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  refresh: async () => {},
  setRefresh: (refreshFn) => set({ refresh: refreshFn }),
}));

export const useMessageStore = createSelectors(useMessage);
