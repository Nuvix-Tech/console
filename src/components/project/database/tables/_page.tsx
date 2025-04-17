"use client";

import { useProjectStore } from "@/lib/store";
import { useSuspenseQuery } from "@tanstack/react-query";

export const TablesPage = () => {
  const { sdk } = useProjectStore();

  async function fetcher() {
    return sdk.schema.getTables("m_do");
  }

  const { data, isPending } = useSuspenseQuery({
    queryFn: fetcher,
    queryKey: ["tables"],
  });

  return <>{!isPending && JSON.stringify(data)}</>;
};
