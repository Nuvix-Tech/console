"use client";

import { useProjectStore } from "@/lib/store";
import { useProvider } from "./components/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { PageContainer } from "@/components/others";
import { DeleteProvider, TopMeta, UpdateName, UpdateSettings } from "./components";

export const ProvidersSinglePage = ({ providerId }: { providerId: string }) => {
  const { sdk } = useProjectStore((state) => state);
  const { setProvider, setLoading, setRefresh } = useProvider((s) => s);

  const fetcher = async (providerId: string) => {
    return await sdk.messaging.getProvider(providerId);
  };

  const { data } = useSuspenseQuery({
    queryKey: ["provider", providerId],
    queryFn: async () => await fetcher(providerId),
  });

  useEffect(() => {
    setProvider(data);
    setLoading(false);
    setRefresh(async () => {
      const data = await fetcher(providerId);
      if (data) {
        setProvider(data);
      }
    });
  }, [data]);

  return (
    <PageContainer>
      <TopMeta />
      <UpdateName />
      <UpdateSettings />
      <DeleteProvider />
    </PageContainer>
  );
};
