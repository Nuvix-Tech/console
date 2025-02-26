"use client";
import { dbPageState } from "@/state/page";
import { getProjectState, projectState } from "@/state/project-state";
import { notFound } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";
import { DatbaseSidebar } from "./components";

type Props = PropsWithChildren & {
  databaseId: string;
};

const DatabaseSingleLayout: React.FC<Props> = ({ children, databaseId }) => {
  const { sdk } = getProjectState();

  projectState.showSubSidebar = true;
  projectState.sidebar.first = null;
  projectState.sidebar.middle = null;
  projectState.sidebar.last = <DatbaseSidebar />;

  dbPageState._update = async () => {
    const db = await sdk?.databases.get(databaseId);
    dbPageState.database = db;
  }

  async function get() {
    if (!sdk) return;
    let db = await sdk?.databases.get(databaseId);
    if (db) {
      dbPageState.database = db;
      dbPageState.loading = false;
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
