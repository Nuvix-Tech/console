import { dbPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { notFound } from "next/navigation";
import React, { PropsWithChildren, use, useEffect } from "react";

type Props = PropsWithChildren & {
  databaseId: string;
};

const DatabaseSingleLayout: React.FC<Props> = ({ children, databaseId }) => {
  const { sdk } = getProjectState();

  async function get() {
    if (sdk) {
      let db = await sdk?.databases.get(databaseId);
      if (db) {
        dbPageState.database = db;
        dbPageState.loading = false;
        return db;
      } else {
        notFound();
      }
    }
  }

  const db = use(get());

  return (
    <>
      {db?.name}
      {children}
    </>
  );
};

export { DatabaseSingleLayout };
