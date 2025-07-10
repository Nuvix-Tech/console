"use client";

import { sdkForConsole } from "@/lib/sdk";
import { useAppStore } from "@/lib/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

export default function OrgLayout({ children, id }: { children: React.ReactNode; id: string }) {
  const { organizations } = sdkForConsole;
  const setOrganization = useAppStore.use.setOrganization();

  async function fetcher() {
    return await organizations.get(id);
  }

  const { data } = useSuspenseQuery({
    queryKey: ["org", id],
    queryFn: fetcher,
  });

  useEffect(() => {
    if (!data) return;
    setOrganization(data);
  }, [data]);

  return children;
}
