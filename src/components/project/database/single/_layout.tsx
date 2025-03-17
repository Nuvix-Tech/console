"use client";
import React, { PropsWithChildren, useEffect } from "react";
import { DatbaseSidebar } from "./components";
import { useDatabaseStore, useProjectStore } from "@/lib/store";
import { useSuspenseQuery } from "@tanstack/react-query";

type Props = PropsWithChildren & {
  databaseId: string;
};

const DatabaseSingleLayout: React.FC<Props> = ({ children, databaseId }) => {
  const sdk = useProjectStore.use.sdk?.();
  const setSidebar = useProjectStore.use.setSidebar();
  const setRefreshFn = useDatabaseStore.use.setRefresh();
  const setDatabase = useDatabaseStore.use.setDatabase();
  const last = <DatbaseSidebar />;

  useEffect(() => {
    setSidebar({ last, first: null, middle: null });
    setRefreshFn(async () => {
      setDatabase(await sdk?.databases.get(databaseId));
    });
  }, []);

  const fetcher = async () => {
    return await sdk.databases.get(databaseId);
  };

  const { data } = useSuspenseQuery({
    queryKey: ["database", databaseId],
    queryFn: fetcher,
  });

  useEffect(() => {
    setDatabase(data);
  }, [data]);

  return <>{children}</>;
};

export { DatabaseSingleLayout };
