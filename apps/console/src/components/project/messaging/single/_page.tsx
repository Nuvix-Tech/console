"use client";

import { PageContainer } from "@/components/others";
import { useProjectStore } from "@/lib/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMessageStore } from "./components/store";
import { useEffect } from "react";
import { TopMeta, UpdateMessage } from "./components";

export const MessageSinglePage = ({ messageId }: { messageId: string }) => {
  const { sdk } = useProjectStore((state) => state);
  const { setMessage, setLoading, setRefresh } = useMessageStore((s) => s);

  const fetcher = async () => sdk.messaging.getMessage(messageId);

  const { data } = useSuspenseQuery({
    queryKey: ["message", messageId],
    queryFn: fetcher,
  });

  useEffect(() => {
    setMessage(data);
    setLoading(false);
    setRefresh(async () => {
      const data = await fetcher();
      if (data) setMessage(data);
    });
  }, [data]);

  return (
    <>
      <PageContainer marginTop="8">
        <TopMeta />
        <UpdateMessage />
      </PageContainer>
    </>
  );
};
