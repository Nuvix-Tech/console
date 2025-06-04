import { PageState } from "@/lib/store";
import { createSelectors } from "@/lib/utils";
import { Models } from "@nuvix/console";
import { create } from "zustand";

interface TopicStore extends PageState {
  topic?: Models.Topic;
  setTopic: (topic?: Models.Topic) => void;
}

export const useTopic = create<TopicStore>((set) => ({
  loading: true,
  setTopic: (topic) => set({ topic }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  // refresh: async () => { },
  // setRefresh: (refreshFn) => set({ refresh: refreshFn }),
}));

export const useTopicStore = createSelectors(useTopic);
