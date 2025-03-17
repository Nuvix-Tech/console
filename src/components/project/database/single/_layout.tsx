"use client";
import { notFound } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";
import { DatbaseSidebar } from "./components";
import { useDatabaseStore, useProjectStore } from "@/lib/store";

type Props = PropsWithChildren & {
  databaseId: string;
};

const DatabaseSingleLayout: React.FC<Props> = ({ children, databaseId }) => {
  const sdk = useProjectStore.use.sdk?.();
  const setSidebar = useProjectStore.use.setSidebar();
  const setRefreshFn = useDatabaseStore.use.setRefresh();
  const setDatabase = useDatabaseStore.use.setDatabase();
  const setLoading = useDatabaseStore.use.setLoading();
  const last = <DatbaseSidebar />;

  useEffect(() => {
    setSidebar({ last, first: null, middle: null });
    setRefreshFn(async () => {
      setDatabase(await sdk?.databases.get(databaseId));
    });
  }, []);

  async function get() {
    if (!sdk) return;
    let db = await sdk?.databases.get(databaseId);
    if (db) {
      setDatabase(db);
      setLoading(false);
      return db;
    } else {
      notFound();
    }
  }

  useEffect(() => {
    get();
  }, [sdk]);

  return <>{children}</>;
};

export { DatabaseSingleLayout };
