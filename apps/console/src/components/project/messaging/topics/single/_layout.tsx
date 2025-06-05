"use client";

import { useProjectStore } from "@/lib/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";
import { useTopicStore } from "../components/store";
import { TopicSidebar } from "../components";

export const TopicLayout = ({ children, topicId }: PropsWithChildren<{ topicId: string }>) => {
  const { sdk, setSidebar } = useProjectStore((state) => state);
  const { setTopic } = useTopicStore((state) => state);

  const fetcher = async () => {
    return await sdk.messaging.getTopic(topicId);
  };

  const middle = <TopicSidebar />;

  useEffect(
    () =>
      setSidebar({
        first: null,
        middle,
      }),
    [setSidebar],
  );

  const { data } = useSuspenseQuery({
    queryKey: ["topics", topicId],
    queryFn: fetcher,
  });

  useEffect(() => {
    setTopic(data);
  }, [data]);

  return children;
};
