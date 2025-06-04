"use client";

import { useTopicStore } from "../components/store";

export const TopicSinglePage = ({}: { topicId: string }) => {
  const { topic } = useTopicStore((state) => state);

  if (!topic) return;

  return <>{JSON.stringify(topic)}</>;
};
