import { PageState, Updatable } from "@/lib/store";
import { createSelectors } from "@/lib/utils";
import { Models } from "@nuvix/console";
import { create } from "zustand";

interface MessageStore extends PageState, Updatable {
  message?: Models.Message;
  setMessage: (message?: Models.Message) => void;
  topicsById: Record<string, Models.Topic>;
  setTopicsById: (topics: Record<string, Models.Topic>) => void;
  targetsById: Record<string, Models.Target>;
  setTargetsById: (targets: Record<string, Models.Target>) => void;
  usersById: Record<string, Models.User<Models.Preferences>>;
  setUsersById: (users: Record<string, Models.User<Models.Preferences>>) => void;
  messageRecipients: Record<string, Models.User<Models.Preferences>>;
  setMessageRecipients: (recipients: Record<string, Models.User<Models.Preferences>>) => void;
}

export const useMessage = create<MessageStore>((set) => ({
  loading: true,
  setMessage: (message) => set({ message }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  refresh: async () => {},
  setRefresh: (refreshFn) => set({ refresh: refreshFn }),
  topicsById: {},
  setTopicsById: (topicsById) => set({ topicsById }),
  targetsById: {},
  setTargetsById: (targetsById) => set({ targetsById }),
  usersById: {},
  setUsersById: (usersById) => set({ usersById }),
  messageRecipients: {},
  setMessageRecipients: (messageRecipients) => set({ messageRecipients }),
}));

export const useMessageStore = createSelectors(useMessage);
